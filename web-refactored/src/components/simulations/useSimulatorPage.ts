import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange } from "@xyflow/react";
import { useNavigate, useParams } from "react-router-dom";

import { getAllElements } from "@api/elements";
import { createProject, getProjectById, runProjectSimulation, updateProject } from "@api/projects";
import { useAuth } from "@/auth/auth";
import { asNumber } from "@models/common";
import type { EnergyElement } from "@models/element";
import type { ProjectDetail } from "@models/project";
import type { SimulationRun } from "@models/simulation";

import { autosaveDelayMs, autosaveIntervalMs, catalogKinds, nodeStyle } from "@components/simulations/simulatorConfig";
import {
  applyEnvironmentToSimulation,
  attachBackendIds,
  buildEdges,
  buildNodes,
  buildProjectPayload,
  createTemporaryProject,
  elementKind,
  elementSearchText,
  isGenerator,
  nodePower,
  readTemporaryDraft,
  withEnvironmentDefaults,
  writeTemporaryDraft,
} from "@components/simulations/simulatorUtils";
import type { CatalogKind, EnergyEdge, EnergyNode, EnergyNodeData } from "@components/simulations/simulatorTypes";

function isForbiddenError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

export function useSimulatorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const userId = user?.id;
  const [catalog, setCatalog] = useState<EnergyElement[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "error" | "ready">("loading");
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
      if (mounted) setCatalogStatus("loading");
      try {
        const elements = await getAllElements();
        if (mounted) {
          setCatalog(elements);
          setCatalogStatus("ready");
        }
      } catch (error) {
        if (mounted) {
          console.error("No se pudo cargar el catalogo", error);
          setCatalog([]);
          setCatalogStatus("error");
        }
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
          setProject(withEnvironmentDefaults(draft?.project ?? createTemporaryProject()));
          setNodes(draft?.nodes ?? []);
          setEdges(draft?.edges ?? []);
          setStatus("");
          setDirty(false);
          setLoading(false);
        }
        return;
      }

      if (!isAuthenticated || !userId) {
        const draft = readTemporaryDraft();
        if (mounted) {
          const localFallback = withEnvironmentDefaults(draft?.project ?? createTemporaryProject());
          setProject({
            ...localFallback,
            id: null,
          });
          setNodes(draft?.nodes ?? []);
          setEdges(draft?.edges ?? []);
          setStatus("Inicia sesion para abrir proyectos guardados del backend. Se ha cargado un borrador local.");
          setDirty(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = withEnvironmentDefaults(await getProjectById(projectId));
        const nextNodes = buildNodes(data, catalog);
        if (mounted) {
          setProject(data);
          setNodes(nextNodes);
          setEdges(buildEdges(data, nextNodes));
          setStatus("");
          setDirty(false);
        }
      } catch (error) {
        if (mounted) {
          if (isForbiddenError(error)) {
            const draft = readTemporaryDraft();
            const localFallback = withEnvironmentDefaults(draft?.project ?? createTemporaryProject());
            setProject({
              ...localFallback,
              id: null,
            });
            setNodes(draft?.nodes ?? []);
            setEdges(draft?.edges ?? []);
            setStatus("No tienes permiso para abrir este proyecto en backend. Se ha cargado un borrador local.");
            setDirty(false);
          } else {
            console.error("No se pudo cargar el proyecto", error);
            setStatus("No se pudo cargar el proyecto seleccionado.");
          }
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
  }, [catalog, isAuthenticated, projectId, userId]);

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

  const addElement = useCallback((element: EnergyElement) => {
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
  }, [markDirty, nodes.length]);

  const updateSelectedNode = useCallback((patch: Partial<EnergyNodeData>) => {
    if (!selectedNodeId) return;
    markDirty();
    setNodes((current) => current.map((node) => (node.id === selectedNodeId ? { ...node, data: { ...node.data, ...patch } } : node)));
  }, [markDirty, selectedNodeId]);

  const updateProjectField = useCallback((name: keyof ProjectDetail, value: string | number | boolean | null) => {
    markDirty();
    setProject((current) => (current ? { ...current, [name]: value } : current));
  }, [markDirty]);

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
      const firstSaveResponse = currentProject.id
        ? await updateProject(currentProject.id, firstPayload)
        : await createProject(firstPayload);
      const firstSave = withEnvironmentDefaults({
        ...firstSaveResponse,
        simulationDate: firstSaveResponse.simulationDate ?? projectForBackend.simulationDate,
      });
      const nodesWithIds = attachBackendIds(nodes, firstSave);
      const secondPayload = buildProjectPayload(firstSave, nodesWithIds, edges);
      const savedResponse = edges.length > 0 && firstSave.id ? await updateProject(firstSave.id, secondPayload) : firstSave;
      const saved = withEnvironmentDefaults({
        ...savedResponse,
        simulationDate: savedResponse.simulationDate ?? firstSave.simulationDate,
      });
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
      if (!options.silent) {
        if (isForbiddenError(error)) {
          setStatus("No tienes permiso para guardar este proyecto en backend. Se ha conservado el borrador local.");
        } else {
          console.error("No se pudo guardar el proyecto", error);
          setStatus("No se pudo guardar el proyecto.");
        }
      }
      return null;
    } finally {
      setSaving(false);
    }
  }, [catalog, edges, isAuthenticated, navigate, nodes, project, projectId, userId]);

  useEffect(() => {
    if (!project || loading) return;
    writeTemporaryDraft(project, nodes, edges);
  }, [edges, loading, nodes, project]);

  useEffect(() => {
    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }

    if (!dirty || !project || loading || !isAuthenticated || !userId) return;

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
    if (!project || loading || !isAuthenticated || !userId) return;

    const interval = window.setInterval(() => {
      if (dirty) {
        void saveDiagram({ silent: true });
      }
    }, autosaveIntervalMs);

    return () => window.clearInterval(interval);
  }, [dirty, isAuthenticated, loading, project, saveDiagram, userId]);

  const simulate = useCallback(async () => {
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
      if (isForbiddenError(error)) {
        setStatus("No tienes permiso para ejecutar la simulacion de este proyecto.");
      } else {
        console.error("No se pudo simular", error);
        setStatus("No se pudo ejecutar POST /projects/{id}/simulations.");
      }
    } finally {
      setSimulating(false);
    }
  }, [isAuthenticated, project?.id, saveDiagram]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    markDirty();
    setNodes((current) => current.filter((node) => node.id !== selectedNodeId));
    setEdges((current) => current.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [markDirty, selectedNodeId]);

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

  const adjustedSimulation = useMemo(() => applyEnvironmentToSimulation(simulation), [simulation]);

  return {
    adjustedSimulation,
    catalogCounts,
    catalogStatus,
    catalogModeTitle,
    catalogSearch,
    catalogSearchTerm,
    deleteSelected,
    edges,
    loading,
    nodes,
    onConnect,
    onEdgesChange,
    onNodesChange,
    project,
    saveDiagram,
    saving,
    selectedCatalogKind,
    selectedNode,
    setCatalogSearch,
    setSelectedCatalogKind,
    setSelectedNodeId,
    simulating,
    simulate,
    status,
    totals,
    updateProjectField,
    updateSelectedNode,
    visibleCatalog,
    addElement,
  };
}
