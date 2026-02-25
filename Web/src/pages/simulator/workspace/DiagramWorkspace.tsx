import { useCallback, useEffect, useMemo, useState } from "react";

import DiagramToolbar from "./diagramToolbar/DiagramToolbar";
import DiagramCanvas from "./diagramCanvas/DiagramCanvas";
import { getProjectById, updateProject } from "../../../api/projects";
import { getAllElements } from "../../../api/elements";
import { resolveElementWattage } from "@/Models/element.model";

import {
    palette,
    generateNodeId,
    attachBackendIdentifiers,
    serializeDiagram,
    normalizeProject,
    buildProjectPayload,
    buildElementDictionary,
    buildElementMetadataCache,
    hydrateNodesWithMetadata,
    hydrateNodesFromCatalog
} from "./WorkspaceUtils";

import "./DiagramWorkspace.css";

function DiagramWorkspace({ projectId }) {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [pendingConnectionId, setPendingConnectionId] = useState(null);
    const [currentTool, setCurrentTool] = useState("select");
    const [zoom, setZoom] = useState(1);
    const [loadingProject, setLoadingProject] = useState(false);
    const [projectData, setProjectData] = useState(null);
    const [elementCatalog, setElementCatalog] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [snapshot, setSnapshot] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

    useEffect(() => {
        let mounted = true;
        getAllElements()
            .then((elements) => {
                if (!mounted) {
                    return;
                }
                setElementCatalog(buildElementDictionary(elements ?? []));
            })
            .catch((error) => {
                console.error("No se pudieron cargar los elementos", error);
                if (mounted) {
                    setElementCatalog(new Map());
                }
            });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!projectId) {
            setProjectData(null);
            setNodes([]);
            setConnections([]);
            setSnapshot(null);
            setError("Selecciona un proyecto para comenzar a diagramar.");
            return;
        }

        let mounted = true;
        setLoadingProject(true);
        setError(null);
        setStatusMessage("");

        getProjectById(projectId)
            .then((project) => {
                if (!mounted) {
                    return;
                }
                setProjectData(project);
                const { nodes: uiNodes, connections: uiConnections } = normalizeProject(project);
                const hydratedNodes = hydrateNodesFromCatalog(uiNodes, elementCatalog);
                setNodes(hydratedNodes);
                setConnections(uiConnections);
                setSnapshot(serializeDiagram(uiNodes, uiConnections));
                setSelectedNodeId(null);
                setPendingConnectionId(null);
            })
            .catch((fetchError) => {
                console.error("No se pudo cargar el proyecto", fetchError);
                if (mounted) {
                    setError("No se pudo cargar el proyecto seleccionado.");
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoadingProject(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [projectId, elementCatalog]);

    useEffect(() => {
        if (!elementCatalog) {
            return;
        }
        setNodes((prev) => hydrateNodesFromCatalog(prev, elementCatalog));
    }, [elementCatalog]);

    useEffect(() => {
        if (!snapshot) {
            setIsDirty(nodes.length > 0 || connections.length > 0);
            return;
        }
        setIsDirty(serializeDiagram(nodes, connections) !== snapshot);
    }, [nodes, connections, snapshot]);

    const addNode = useCallback((partialNode = {}, position) => {
        const newId = partialNode.id ?? generateNodeId();
        setNodes((prev) => {
            const nextPosition = position ?? {
                x: 220 + prev.length * 40,
                y: 160 + prev.length * 24
            };

            const node = {
                id: newId,
                backendId: partialNode.backendId ?? null,
                elementId: partialNode.elementId ?? partialNode.meta?.id ?? null,
                label: partialNode.label ?? "Nuevo elemento",
                type: partialNode.type ?? "custom",
                wattage: partialNode.wattage ?? null,
                notes: partialNode.notes ?? "",
                color: partialNode.color ?? palette[prev.length % palette.length],
                position: nextPosition,
                meta: partialNode.meta ?? {}
            };

            return [...prev, node];
        });
        setSelectedNodeId(newId);
    }, []);

    const moveNode = useCallback((nodeId, position) => {
        setNodes((prev) => prev.map((node) => (
            node.id === nodeId
                ? {
                    ...node,
                    position
                }
                : node
        )));
    }, []);

    const dropElement = useCallback((payload, position) => {
        if (!payload) {
            return;
        }

        addNode({
            label: payload.name ?? payload.model ?? "Elemento",
            type: payload.category ?? payload.type ?? "catálogo",
            wattage: resolveElementWattage(payload),
            notes: payload.description ?? "",
            color: "#FDE68A",
            meta: payload,
            elementId: payload.id ?? null
        }, position);
    }, [addNode]);

    const requestConnection = useCallback((nodeId) => {
        setPendingConnectionId((current) => {
            if (current && current !== nodeId) {
                setConnections((prev) => {
                    const exists = prev.some((conn) => conn.source === current && conn.target === nodeId);
                    if (exists) {
                        return prev;
                    }
                    return [...prev, {
                        id: `${current}-${nodeId}`,
                        backendId: null,
                        source: current,
                        target: nodeId,
                        connectionType: "",
                        label: ""
                    }];
                });
                setCurrentTool("select");
                return null;
            }

            return current === nodeId ? null : nodeId;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedNodeId(null);
        setPendingConnectionId(null);
    }, []);

    const deleteSelectedNode = useCallback(() => {
        if (!selectedNodeId) {
            return;
        }

        setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
        setConnections((prev) => prev.filter((conn) => conn.source !== selectedNodeId && conn.target !== selectedNodeId));
        setSelectedNodeId(null);
    }, [selectedNodeId]);

    const clearDiagram = useCallback(() => {
        setNodes([]);
        setConnections([]);
        setSelectedNodeId(null);
        setPendingConnectionId(null);
    }, []);

    const duplicateSelectedNode = useCallback(() => {
        if (!selectedNode) {
            return;
        }
        const duplicated = {
            ...selectedNode,
            id: generateNodeId(),
            backendId: null,
            label: `${selectedNode.label} copia`,
            position: {
                x: selectedNode.position.x + 40,
                y: selectedNode.position.y + 40
            }
        };
        addNode(duplicated, duplicated.position);
    }, [selectedNode, addNode]);

    const exportDiagram = useCallback(() => {
        const payload = JSON.stringify({ nodes, connections }, null, 2);
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "simulator-diagram.json";
        anchor.click();
        URL.revokeObjectURL(url);
    }, [nodes, connections]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const target = event.target;
            const isInputTarget = target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
            if ((event.key === "Delete" || event.key === "Backspace") && !isInputTarget) {
                deleteSelectedNode();
            }
            if (event.key === "Escape") {
                clearSelection();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [deleteSelectedNode, clearSelection]);

    const stats = useMemo(() => ({
        nodes: nodes.length,
        connections: connections.length,
        totalWattage: nodes.reduce((acc, node) => acc + (Number(node.wattage) || 0), 0)
    }), [nodes, connections]);

    const handleSave = useCallback(async () => {
        if (!projectId || !projectData) {
            return;
        }

        const nodesWithoutElement = nodes.filter((node) => !(node.elementId ?? node.meta?.id));
        if (nodesWithoutElement.length > 0) {
            setStatusMessage("No se puede guardar: elimina o reemplaza los nodos sin elemento.");
            if (!selectedNodeId && nodesWithoutElement[0]) {
                setSelectedNodeId(nodesWithoutElement[0].id);
            }
            return;
        }

        const elementMetadataCache = buildElementMetadataCache(nodes);

        setSaving(true);
        setStatusMessage("");

        const workingConnections = connections.map((connection) => ({ ...connection }));
        let workingNodes = nodes.map((node) => ({ ...node }));
        let latestProjectData = projectData;
        let updatedProject = null;
        let totalSkippedNodes = 0;
        let initialSkippedConnections = 0;
        let lastSkippedConnections = 0;
        let autoRetryUsed = false;
        const MAX_ATTEMPTS = 2;

        try {
            for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
                const { payload, skippedNodes, skippedConnections } = buildProjectPayload(
                    latestProjectData,
                    workingNodes,
                    workingConnections
                );

                totalSkippedNodes += skippedNodes;
                lastSkippedConnections = skippedConnections;
                if (attempt === 1) {
                    initialSkippedConnections = skippedConnections;
                }

                const response = await updateProject(projectId, payload);
                updatedProject = response;
                latestProjectData = response;

                if (skippedConnections > 0 && attempt < MAX_ATTEMPTS) {
                    workingNodes = attachBackendIdentifiers(workingNodes, response.projectNodes ?? []);
                    autoRetryUsed = true;
                    continue;
                }

                break;
            }

            if (!updatedProject) {
                throw new Error("No se recibió respuesta del servidor al guardar.");
            }

            setProjectData(updatedProject);
            const { nodes: uiNodes, connections: uiConnections } = normalizeProject(updatedProject);
            const catalogEnrichedNodes = hydrateNodesFromCatalog(uiNodes, elementCatalog);
            const hydratedNodes = hydrateNodesWithMetadata(catalogEnrichedNodes, elementMetadataCache);
            setNodes(hydratedNodes);
            setConnections(uiConnections);
            setSelectedNodeId(null);
            setPendingConnectionId(null);
            const newSnapshot = serializeDiagram(hydratedNodes, uiConnections);
            setSnapshot(newSnapshot);

            const statusParts = [];
            if (totalSkippedNodes > 0) {
                statusParts.push(`${totalSkippedNodes} nodo(s) sin elemento no se guardaron`);
            }
            if (autoRetryUsed && initialSkippedConnections > 0 && lastSkippedConnections === 0) {
                statusParts.push("Conexiones nuevas vinculadas automáticamente");
            }
            if (lastSkippedConnections > 0) {
                statusParts.push(`Aún hay ${lastSkippedConnections} conexión(es) sin guardar. Vuelve a intentar.`);
            }

            if (statusParts.length === 0) {
                setStatusMessage("Diagrama guardado correctamente.");
            } else {
                setStatusMessage(`Guardado parcial: ${statusParts.join(" ")}`);
            }
            setError(null);
        } catch (saveError) {
            console.error("No se pudo guardar el diagrama", saveError);
            setStatusMessage("No se pudo guardar el diagrama.");
        } finally {
            setSaving(false);
        }
    }, [projectId, projectData, nodes, connections, selectedNodeId, elementCatalog]);

    return (
        <section className="diagram-workspace">
            <div className="diagram-stage">
                <DiagramToolbar
                    onClear={clearDiagram}
                    currentTool={currentTool}
                    onChangeTool={(tool) => {
                        setCurrentTool(tool);
                        setPendingConnectionId(null);
                    }}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    onExport={exportDiagram}
                    canDeleteSelection={Boolean(selectedNodeId)}
                    onDeleteSelection={deleteSelectedNode}
                    onDuplicateSelection={duplicateSelectedNode}
                    stats={stats}
                    onSave={handleSave}
                    canSave={Boolean(projectId && projectData)}
                    saving={saving}
                    hasChanges={isDirty}
                    statusMessage={statusMessage}
                    loadingProject={loadingProject}
                />

                <div className="diagram-stage-body">
                    {error && (
                        <p className="diagram-banner error">{error}</p>
                    )}
                    {!error && loadingProject && (
                        <p className="diagram-banner">Cargando diagrama...</p>
                    )}

                    <div className="diagram-stage-main">
                        {projectId ? (
                            <DiagramCanvas
                                nodes={nodes}
                                connections={connections}
                                selectedNodeId={selectedNodeId}
                                pendingConnectionId={pendingConnectionId}
                                currentTool={currentTool}
                                zoom={zoom}
                                onSelectNode={setSelectedNodeId}
                                onClearSelection={clearSelection}
                                onNodeMove={moveNode}
                                onRequestConnection={requestConnection}
                                onDropElement={dropElement}
                                onZoomChange={setZoom}
                            />
                        ) : (
                            <div className="diagram-placeholder">
                                Selecciona un proyecto para comenzar a construir tu red.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DiagramWorkspace;
