import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate, useParams } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaBatteryHalf, FaBolt, FaChartLine, FaIndustry, FaPlay, FaSave, FaSearch, FaSolarPanel, FaTrash } from "react-icons/fa";

import { getAllElements } from "../../api/elements";
import { createProject, getProjectById, runProjectSimulation, updateProject } from "../../api/projects";
import { useAuth } from "../../auth/auth";
import { asNumber, type Identifier, type LooseRecord } from "../../models/common";
import type { EnergyElement } from "../../models/element";
import type { ProjectDetail, ProjectMutation, ProjectNodeApi } from "../../models/project";
import type { SimulationPoint, SimulationRun } from "../../models/simulation";
import "./Simulator.css";

type EnergyNodeData = {
  backendId?: Identifier | null;
  elementId?: Identifier | null;
  label: string;
  typeLabel: string;
  wattage?: number | string | null;
  quantity?: number;
  notes?: string;
  element?: EnergyElement | null;
};

type EnergyNode = Node<EnergyNodeData>;
type EnergyEdge = Edge<{ backendId?: Identifier | null; connectionType?: string }>;
type CatalogKind = "generator" | "consumer" | "storage";

const nodeTypes = {
  energy: EnergyNodeCard,
};

const palette = [
  "color-mix(in srgb, var(--accent-main) 24%, var(--surface-card))",
  "color-mix(in srgb, var(--accent-alt) 24%, var(--surface-card))",
  "color-mix(in srgb, #f7d56f 24%, var(--surface-card))",
  "color-mix(in srgb, #ff8f7c 18%, var(--surface-card))",
  "color-mix(in srgb, var(--text-high) 12%, var(--surface-card))",
];

function nodeStyle(index: number): CSSProperties {
  return {
    "--node-bg": palette[index % palette.length],
    background: "transparent",
  } as CSSProperties;
}

const numberFormat = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
const tempDraftKey = "energy-simulator:temporary-draft";
const autosaveDelayMs = 2000;
const autosaveIntervalMs = 5 * 60 * 1000;
const catalogKinds: Array<{ kind: CatalogKind; label: string; icon: IconType }> = [
  { kind: "generator", label: "Generadores", icon: FaSolarPanel },
  { kind: "consumer", label: "Consumidores", icon: FaIndustry },
  { kind: "storage", label: "Almacenadores", icon: FaBatteryHalf },
];

type SimulatorDraft = {
  project: ProjectDetail;
  nodes: EnergyNode[];
  edges: EnergyEdge[];
};

function createTemporaryProject(): ProjectDetail {
  return {
    name: "Simulacion temporal",
    season: "verano",
    latitude: 28.1,
    longitude: -15.4,
    timezone: "auto",
    tiltAngle: 30,
    azimuth: 0,
    durationDays: 1,
    simulationMode: "open-meteo",
    systemLossPercent: 14,
    energyEnough: false,
    energyNeeded: 0,
    projectNodes: [],
    nodeConnections: [],
  };
}

function readTemporaryDraft(): SimulatorDraft | null {
  try {
    const stored = localStorage.getItem(tempDraftKey);
    return stored ? (JSON.parse(stored) as SimulatorDraft) : null;
  } catch {
    return null;
  }
}

function writeTemporaryDraft(project: ProjectDetail, nodes: EnergyNode[], edges: EnergyEdge[]) {
  localStorage.setItem(tempDraftKey, JSON.stringify({ project, nodes, edges }));
}

function parseData(value: unknown): LooseRecord {
  if (!value) {
    return {};
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? (parsed as LooseRecord) : {};
    } catch {
      return {};
    }
  }
  return typeof value === "object" ? (value as LooseRecord) : {};
}

function resolveElementId(node: ProjectNodeApi | EnergyNode): Identifier | null {
  if ("position" in node) {
    return (node as EnergyNode).data.elementId ?? null;
  }

  const apiNode = node as ProjectNodeApi;
  const element = apiNode.element as EnergyElement | undefined | null;
  const value = element?.id ?? apiNode.elementIdReference ?? null;
  return typeof value === "string" || typeof value === "number" ? value : null;
}

function nodePower(element?: EnergyElement | null, data?: LooseRecord) {
  const value = data?.powerWatt ?? data?.powerConsumption ?? data?.baseConsumption ?? element?.powerWatt ?? element?.powerConsumption ?? element?.capacity ?? null;
  return typeof value === "string" || typeof value === "number" ? value : null;
}

function isGenerator(element?: EnergyElement | null, data?: EnergyNodeData) {
  const text = `${element?.elementType ?? ""} ${element?.category ?? ""} ${data?.typeLabel ?? ""}`.toLowerCase();
  return text.includes("generator") || text.includes("generacion") || text.includes("solar") || text.includes("panel");
}

function elementSearchText(element: EnergyElement) {
  return [
    element.name,
    element.elementType,
    element.category,
    element.description,
    element.brand,
    element.profileType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function elementKind(element: EnergyElement): CatalogKind {
  const text = elementSearchText(element);
  if (text.includes("storage") || text.includes("almacen") || text.includes("bater")) {
    return "storage";
  }
  if (text.includes("consumer") || text.includes("consumo") || text.includes("carga") || text.includes("factory") || text.includes("resid")) {
    return "consumer";
  }
  return "generator";
}

function EnergyNodeCard({ data, selected }: { data: EnergyNodeData; selected?: boolean }) {
  return (
    <div className={`energy-node-card${selected ? " selected" : ""}`}>
      <Handle type="target" position={Position.Left} />
      <strong>{data.label}</strong>
      <span>{data.typeLabel}</span>
      {(data.quantity ?? 1) > 1 && <small>x{data.quantity}</small>}
      {data.wattage != null && <small>{data.wattage} W</small>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function buildNodes(project: ProjectDetail, catalog: EnergyElement[]): EnergyNode[] {
  const catalogById = new Map(catalog.map((element) => [String(element.id), element]));
  return (project.projectNodes ?? []).map((node, index) => {
    const elementId = resolveElementId(node);
    const element = elementId == null ? null : catalogById.get(String(elementId)) ?? (node.element as EnergyElement | null);
    const data = parseData(node.data);
    return {
      id: node.id ? `node-${node.id}` : `node-local-${index}`,
      type: "energy",
      position: {
        x: asNumber(node.positionX, 160 + index * 36),
        y: asNumber(node.positionY, 140 + index * 34),
      },
      data: {
        backendId: node.id ?? null,
        elementId,
        label: String(data.label ?? element?.name ?? `Nodo ${index + 1}`),
        typeLabel: String(node.type ?? element?.elementType ?? element?.category ?? "Elemento"),
        wattage: nodePower(element, data),
        quantity: Math.max(1, asNumber(node.quantity ?? data.quantity, 1)),
        notes: String(data.notes ?? ""),
        element,
      },
      style: nodeStyle(index),
    };
  });
}

function buildEdges(project: ProjectDetail, nodes: EnergyNode[]): EnergyEdge[] {
  const byBackendId = new Map(nodes.map((node) => [String(node.data.backendId), node.id]));
  const result: EnergyEdge[] = [];
  (project.nodeConnections ?? []).forEach((connection) => {
    const source = byBackendId.get(String(connection.source?.id));
    const target = byBackendId.get(String(connection.target?.id));
    if (!source || !target) {
      return;
    }
    result.push({
        id: connection.id ? `edge-${connection.id}` : `edge-${source}-${target}`,
        source,
        target,
        label: connection.connectionType ?? "",
        data: { backendId: connection.id ?? null, connectionType: connection.connectionType ?? "" },
    });
  });
  return result;
}

function buildProjectPayload(project: ProjectDetail, nodes: EnergyNode[], edges: EnergyEdge[]): ProjectMutation {
  const projectNodes = nodes
    .filter((node) => node.data.elementId != null)
    .map((node) => ({
      id: node.data.backendId ?? null,
      element: { id: node.data.elementId },
      positionX: Math.round(node.position.x * 100) / 100,
      positionY: Math.round(node.position.y * 100) / 100,
      type: node.data.typeLabel,
      quantity: Math.max(1, asNumber(node.data.quantity, 1)),
      data: JSON.stringify({
        label: node.data.label,
        notes: node.data.notes ?? "",
        powerWatt: node.data.wattage,
        quantity: Math.max(1, asNumber(node.data.quantity, 1)),
      }),
    }));

  const backendByNodeId = new Map(nodes.map((node) => [node.id, node.data.backendId]));
  const nodeConnections = edges
    .map((edge) => {
      const sourceId = backendByNodeId.get(edge.source);
      const targetId = backendByNodeId.get(edge.target);
      if (!sourceId || !targetId) {
        return null;
      }
      return {
        id: edge.data?.backendId ?? null,
        source: { id: sourceId },
        target: { id: targetId },
        connectionType: edge.data?.connectionType ?? "",
      };
    })
    .filter(Boolean) as NonNullable<ProjectMutation["nodeConnections"]>;

  return {
    id: project.id,
    name: project.name,
    season: project.season,
    latitude: project.latitude,
    longitude: project.longitude,
    timezone: project.timezone,
    tiltAngle: project.tiltAngle,
    azimuth: project.azimuth,
    durationDays: project.durationDays,
    simulationMode: project.simulationMode,
    systemLossPercent: project.systemLossPercent,
    energyNeeded: project.energyNeeded,
    energyEnough: project.energyEnough,
    userId: project.userId,
    projectNodes,
    nodeConnections,
  };
}

function attachBackendIds(nodes: EnergyNode[], updated: ProjectDetail) {
  const remaining = [...(updated.projectNodes ?? [])];
  return nodes.map((node) => {
    if (node.data.backendId) {
      return node;
    }
    const matchIndex = remaining.findIndex((apiNode) => String(resolveElementId(apiNode)) === String(node.data.elementId));
    const match = matchIndex >= 0 ? remaining.splice(matchIndex, 1)[0] : null;
    return match?.id ? { ...node, data: { ...node.data, backendId: match.id } } : node;
  });
}

function SimulatorInner() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id;
  const [catalog, setCatalog] = useState<EnergyElement[]>([]);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [nodes, setNodes] = useState<EnergyNode[]>([]);
  const [edges, setEdges] = useState<EnergyEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulation, setSimulation] = useState<SimulationRun | null>(null);
  const [dirty, setDirty] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCatalogKind, setSelectedCatalogKind] = useState<CatalogKind | null>(null);
  const autosaveTimer = useRef<number | null>(null);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
  const catalogSearchTerm = catalogSearch.trim().toLowerCase();
  const catalogCounts = useMemo(() => {
    return catalog.reduce<Record<CatalogKind, number>>(
      (acc, element) => {
        acc[elementKind(element)] += 1;
        return acc;
      },
      { generator: 0, consumer: 0, storage: 0 },
    );
  }, [catalog]);
  const visibleCatalog = useMemo(() => {
    if (catalogSearchTerm) {
      return catalog.filter((element) => elementSearchText(element).includes(catalogSearchTerm));
    }
    if (selectedCatalogKind) {
      return catalog.filter((element) => elementKind(element) === selectedCatalogKind);
    }
    return [];
  }, [catalog, catalogSearchTerm, selectedCatalogKind]);
  const catalogModeTitle = catalogSearchTerm
    ? `Resultados para "${catalogSearch.trim()}"`
    : selectedCatalogKind
      ? catalogKinds.find((item) => item.kind === selectedCatalogKind)?.label ?? "Elementos"
      : "Tipos de elemento";

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      const elements = await getAllElements();
      if (mounted) {
        setCatalog(elements);
      }
    }

    void loadCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      if (!projectId) {
        const draft = readTemporaryDraft();
        if (mounted) {
          setProject(draft?.project ?? createTemporaryProject());
          setNodes(draft?.nodes ?? []);
          setEdges(draft?.edges ?? []);
          setStatus("");
          setDirty(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await getProjectById(projectId);
        const nextNodes = buildNodes(data, catalog);
        if (mounted) {
          setProject(data);
          setNodes(nextNodes);
          setEdges(buildEdges(data, nextNodes));
          setStatus("");
          setDirty(false);
        }
      } catch (error) {
        console.error("No se pudo cargar el proyecto", error);
        if (mounted) {
          setStatus("No se pudo cargar el proyecto seleccionado.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProject();
    return () => {
      mounted = false;
    };
  }, [catalog, projectId]);

  const markDirty = useCallback(() => setDirty(true), []);
  const onNodesChange = useCallback((changes: NodeChange<EnergyNode>[]) => {
    if (changes.some((change) => change.type !== "select" && change.type !== "dimensions")) {
      markDirty();
    }
    setNodes((current) => applyNodeChanges(changes, current));
  }, [markDirty]);
  const onEdgesChange = useCallback((changes: EdgeChange<EnergyEdge>[]) => {
    if (changes.some((change) => change.type !== "select")) {
      markDirty();
    }
    setEdges((current) => applyEdgeChanges(changes, current));
  }, [markDirty]);
  const onConnect = useCallback((connection: Connection) => {
    markDirty();
    setEdges((current) => addEdge({ ...connection, animated: true }, current));
  }, [markDirty]);

  function addElement(element: EnergyElement) {
    const id = `node-${crypto.randomUUID()}`;
    const index = nodes.length;
    markDirty();
    setNodes((current) => [
      ...current,
      {
        id,
        type: "energy",
        position: { x: 180 + index * 36, y: 130 + index * 28 },
        data: {
          backendId: null,
          elementId: element.id ?? null,
          label: element.name ?? "Elemento",
          typeLabel: element.elementType ?? element.category ?? "Catalogo",
          wattage: nodePower(element),
          quantity: 1,
          notes: element.description ?? "",
          element,
        },
        style: nodeStyle(index),
      },
    ]);
    setSelectedNodeId(id);
  }

  function updateSelectedNode(patch: Partial<EnergyNodeData>) {
    if (!selectedNodeId) {
      return;
    }
    markDirty();
    setNodes((current) => current.map((node) => (node.id === selectedNodeId ? { ...node, data: { ...node.data, ...patch } } : node)));
  }

  function updateProjectField(name: keyof ProjectDetail, value: string | number) {
    markDirty();
    setProject((current) => (current ? { ...current, [name]: value } : current));
  }

  const saveDiagram = useCallback(async (options: { silent?: boolean } = {}) => {
    const currentProject = project ?? createTemporaryProject();
    writeTemporaryDraft(currentProject, nodes, edges);

    if (!isAuthenticated || !userId) {
      if (!options.silent) {
        setStatus("Borrador temporal guardado en este navegador. Inicia sesion para guardarlo en backend.");
      }
      return currentProject;
    }

    setSaving(true);
    if (!options.silent) {
      setStatus("");
    }
    try {
      const projectForBackend = {
        ...currentProject,
        userId: currentProject.userId ?? userId,
      };
      const firstPayload = buildProjectPayload(projectForBackend, nodes, []);
      const firstSave = currentProject.id
        ? await updateProject(currentProject.id, firstPayload)
        : await createProject(firstPayload);
      const nodesWithIds = attachBackendIds(nodes, firstSave);
      const secondPayload = buildProjectPayload(firstSave, nodesWithIds, edges);
      const saved = edges.length > 0 && firstSave.id ? await updateProject(firstSave.id, secondPayload) : firstSave;
      const finalNodes = buildNodes(saved, catalog);
      const finalEdges = buildEdges(saved, finalNodes);
      setProject(saved);
      setNodes(finalNodes);
      setEdges(finalEdges);
      setDirty(false);
      writeTemporaryDraft(saved, finalNodes, finalEdges);
      if (!projectId && saved.id) {
        navigate(`/simulator/${saved.id}`, { replace: true });
      }
      if (!options.silent) {
        setStatus("Proyecto guardado.");
      }
      return saved;
    } catch (error) {
      console.error("No se pudo guardar el proyecto", error);
      if (!options.silent) {
        setStatus("No se pudo guardar el proyecto.");
      }
      return null;
    } finally {
      setSaving(false);
    }
  }, [catalog, edges, isAuthenticated, navigate, nodes, project, projectId, userId]);

  useEffect(() => {
    if (!project || loading) {
      return;
    }
    writeTemporaryDraft(project, nodes, edges);
  }, [edges, loading, nodes, project]);

  useEffect(() => {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }

    if (!dirty || !project || loading || !isAuthenticated || !userId) {
      return;
    }

    autosaveTimer.current = window.setTimeout(() => {
      void saveDiagram({ silent: true });
    }, autosaveDelayMs);

    return () => {
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
        autosaveTimer.current = null;
      }
    };
  }, [dirty, isAuthenticated, loading, project, saveDiagram, userId]);

  useEffect(() => {
    if (!project || loading || !isAuthenticated || !userId) {
      return;
    }

    const interval = window.setInterval(() => {
      if (dirty) {
        void saveDiagram({ silent: true });
      }
    }, autosaveIntervalMs);

    return () => window.clearInterval(interval);
  }, [dirty, isAuthenticated, loading, project, saveDiagram, userId]);

  async function simulate() {
    if (!project?.id && !isAuthenticated) {
      setStatus("Puedes montar el esquema sin sesion; para ejecutar la simulacion Open-Meteo necesitas guardar el proyecto con una sesion iniciada.");
      return;
    }

    setSimulating(true);
    setStatus("Guardando antes de simular...");
    try {
      const saved = await saveDiagram();
      if (!saved?.id) {
        return;
      }
      setStatus("Ejecutando simulacion...");
      const result = await runProjectSimulation(saved.id, saved);
      setSimulation(result);
      setProject((current) => current ? { ...current, energyEnough: result.energyEnough ?? current.energyEnough } : current);
      setStatus("Simulacion completada.");
    } catch (error) {
      console.error("No se pudo simular", error);
      setStatus("No se pudo ejecutar POST /projects/{id}/simulations.");
    } finally {
      setSimulating(false);
    }
  }

  function deleteSelected() {
    if (!selectedNodeId) {
      return;
    }
    markDirty();
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  }

  const totals = useMemo(() => {
    let generation = 0;
    let consumption = 0;
    nodes.forEach((node) => {
      const power = asNumber(node.data.wattage);
      const quantity = Math.max(1, asNumber(node.data.quantity, 1));
      if (isGenerator(node.data.element, node.data)) {
        generation += power * quantity;
      } else {
        consumption += power * quantity;
      }
    });
    return { generation, consumption, balance: generation - consumption };
  }, [nodes]);

  return (
    <main className="simulator-page">
      <aside className="catalog-panel">
        <header>
          <p className="eyebrow">Catalogo</p>
          <h1>Simulador</h1>
        </header>
        <label className="catalog-search">
          <span>
            <FaSearch aria-hidden="true" />
            Buscar
          </span>
          <input
            type="search"
            value={catalogSearch}
            onChange={(event) => setCatalogSearch(event.target.value)}
            placeholder="Nombre, tipo, marca..."
          />
        </label>
        <div className="catalog-list-header">
          <strong>{catalogModeTitle}</strong>
          {(selectedCatalogKind || catalogSearchTerm) && (
            <button
              type="button"
              className="catalog-back-button"
              onClick={() => {
                setCatalogSearch("");
                setSelectedCatalogKind(null);
              }}
            >
              Volver
            </button>
          )}
        </div>
        <div className="catalog-list">
          {!catalogSearchTerm && !selectedCatalogKind && catalogKinds.map(({ kind, label, icon: Icon }) => (
            <button type="button" className="catalog-type-button" key={kind} onClick={() => setSelectedCatalogKind(kind)}>
              <Icon aria-hidden="true" />
              <strong>{label}</strong>
              <span>{catalogCounts[kind]} elementos</span>
            </button>
          ))}

          {(catalogSearchTerm || selectedCatalogKind) && visibleCatalog.map((element) => (
            <button type="button" key={String(element.id ?? element.name)} onClick={() => addElement(element)}>
              <strong>{element.name ?? "Elemento"}</strong>
              <span>{element.category ?? element.elementType ?? "Catalogo"}</span>
            </button>
          ))}

          {(catalogSearchTerm || selectedCatalogKind) && visibleCatalog.length === 0 && (
            <p className="catalog-empty">No hay elementos que coincidan.</p>
          )}
        </div>
      </aside>

      <section className="flow-shell">
        <div className="simulator-toolbar">
          <input value={project?.name ?? ""} onChange={(event) => updateProjectField("name", event.target.value)} aria-label="Nombre del proyecto" />
          <div className="toolbar-actions">
            <button type="button" onClick={() => void saveDiagram()} disabled={saving || loading}>
              <FaSave aria-hidden="true" />
              {saving ? "Guardando" : "Guardar"}
            </button>
            <button type="button" className="simulate-button" onClick={simulate} disabled={simulating || loading}>
              <FaPlay aria-hidden="true" />
              {simulating ? "Simulando" : "Simular"}
            </button>
          </div>
        </div>

        {status && <p className="simulator-status">{status}</p>}

        <div className="flow-canvas">
          {loading ? (
            <p className="canvas-message">Cargando proyecto...</p>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              style={{ width: "100%", height: "100%" }}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              onPaneClick={() => setSelectedNodeId(null)}
              fitView
            >
              <Background />
              <MiniMap pannable zoomable />
              <Controls />
            </ReactFlow>
          )}
        </div>
      </section>

      <aside className="properties-panel">
        <section>
          <h2>Proyecto</h2>
          <div className="mini-stats">
            <article>
              <FaBolt aria-hidden="true" />
              <span>{numberFormat.format(totals.generation)} W</span>
              <small>Generacion</small>
            </article>
            <article>
              <span>{numberFormat.format(totals.consumption)} W</span>
              <small>Consumo</small>
            </article>
            <article>
              <span>{numberFormat.format(totals.balance)} W</span>
              <small>Balance</small>
            </article>
          </div>
          <label>
            Latitud
            <input type="number" value={project?.latitude ?? 28.1} onChange={(event) => updateProjectField("latitude", Number(event.target.value))} />
          </label>
          <label>
            Longitud
            <input type="number" value={project?.longitude ?? -15.4} onChange={(event) => updateProjectField("longitude", Number(event.target.value))} />
          </label>
          <label>
            Dias
            <input type="number" min="1" max="7" value={project?.durationDays ?? 1} onChange={(event) => updateProjectField("durationDays", Number(event.target.value))} />
          </label>
          <label>
            Inclinacion
            <input type="number" value={project?.tiltAngle ?? 30} onChange={(event) => updateProjectField("tiltAngle", Number(event.target.value))} />
          </label>
        </section>

        <section>
          <h2>Propiedades</h2>
          {selectedNode ? (
            <>
              <label>
                Nombre
                <input value={selectedNode.data.label} onChange={(event) => updateSelectedNode({ label: event.target.value })} />
              </label>
              <label>
                Potencia W
                <input type="number" value={String(selectedNode.data.wattage ?? "")} onChange={(event) => updateSelectedNode({ wattage: Number(event.target.value) })} />
              </label>
              <label>
                Cantidad
                <input type="number" min="1" value={selectedNode.data.quantity ?? 1} onChange={(event) => updateSelectedNode({ quantity: Math.max(1, Number(event.target.value) || 1) })} />
              </label>
              <label>
                Notas
                <textarea value={selectedNode.data.notes ?? ""} onChange={(event) => updateSelectedNode({ notes: event.target.value })} />
              </label>
              <button type="button" className="danger-button" onClick={deleteSelected}>
                <FaTrash aria-hidden="true" />
                Eliminar nodo
              </button>
            </>
          ) : (
            <p>Selecciona un nodo para editarlo.</p>
          )}
        </section>

        <SimulationPanel simulation={simulation} />
      </aside>
    </main>
  );
}

function SimulationPanel({ simulation }: { simulation: SimulationRun | null }) {
  const points = simulation?.points ?? [];
  const chartPoints = points.slice(0, 72);
  const maxValue = Math.max(1, ...chartPoints.flatMap((point) => [asNumber(point.generationW), asNumber(point.consumptionW)]));

  const polyline = (field: keyof Pick<SimulationPoint, "generationW" | "consumptionW" | "balanceW">) =>
    chartPoints
      .map((point, index) => {
        const x = chartPoints.length <= 1 ? 0 : (index / (chartPoints.length - 1)) * 280;
        const y = 120 - ((asNumber(point[field]) + (field === "balanceW" ? maxValue : 0)) / (field === "balanceW" ? maxValue * 2 : maxValue)) * 110;
        return `${x},${Math.max(6, Math.min(116, y))}`;
      })
      .join(" ");

  return (
    <section className="simulation-panel">
      <h2>
        <FaChartLine aria-hidden="true" />
        Resultados
      </h2>
      {!simulation ? (
        <p>Ejecuta una simulacion para ver curvas y tabla.</p>
      ) : (
        <>
          <div className="result-summary">
            <article>
              <strong>{numberFormat.format(simulation.totalGenerationKwh ?? 0)}</strong>
              <span>kWh generados</span>
            </article>
            <article>
              <strong>{numberFormat.format(simulation.totalConsumptionKwh ?? 0)}</strong>
              <span>kWh consumidos</span>
            </article>
            <article>
              <strong>{numberFormat.format(simulation.selfSufficiencyPercent ?? 0)}%</strong>
              <span>Autosuficiencia</span>
            </article>
          </div>
          <svg className="simulation-chart" viewBox="0 0 280 128" role="img" aria-label="Curvas de simulacion">
            <polyline points={polyline("generationW")} className="line generation" />
            <polyline points={polyline("consumptionW")} className="line consumption" />
            <polyline points={polyline("balanceW")} className="line balance" />
          </svg>
          <div className="simulation-table-wrap">
            <table className="simulation-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Gen.</th>
                  <th>Cons.</th>
                  <th>Balance</th>
                  <th>Nubes</th>
                  <th>Irrad.</th>
                </tr>
              </thead>
              <tbody>
                {points.slice(0, 48).map((point, index) => (
                  <tr key={point.id ?? `${point.timestamp}-${index}`}>
                    <td>{point.timestamp ?? index}</td>
                    <td>{numberFormat.format(point.generationW ?? 0)}</td>
                    <td>{numberFormat.format(point.consumptionW ?? 0)}</td>
                    <td>{numberFormat.format(point.balanceW ?? 0)}</td>
                    <td>{numberFormat.format(point.cloudCover ?? 0)}%</td>
                    <td>{numberFormat.format(point.irradiance ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function Simulator() {
  return (
    <ReactFlowProvider>
      <SimulatorInner />
    </ReactFlowProvider>
  );
}

export default Simulator;
