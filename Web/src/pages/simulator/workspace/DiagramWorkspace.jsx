import { useCallback, useEffect, useMemo, useState } from "react";

import DiagramToolbar from "./diagramToolbar/DiagramToolbar";
import DiagramCanvas from "./diagramCanvas/DiagramCanvas";

import "./DiagramWorkspace.css";

const palette = [
    "#C5E7FF",
    "#FFE4C4",
    "#E6E9FF",
    "#DCFCE7",
    "#FFF3C4"
];

const generateNodeId = () => `node-${Math.random().toString(36).slice(2, 9)}`;

const snapPosition = (position, spacing = 20) => ({
    x: Math.round(position.x / spacing) * spacing,
    y: Math.round(position.y / spacing) * spacing
});

function DiagramWorkspace() {
    const [nodes, setNodes] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [pendingConnectionId, setPendingConnectionId] = useState(null);
    const [currentTool, setCurrentTool] = useState("select");
    const [zoom, setZoom] = useState(1);
    const [snapToGrid, setSnapToGrid] = useState(true);

    const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

    const addNode = useCallback((partialNode = {}, position) => {
        const newId = partialNode.id ?? generateNodeId();
        setNodes((prev) => {
            const nextPosition = position ?? {
                x: 220 + prev.length * 40,
                y: 160 + prev.length * 24
            };

            const node = {
                id: newId,
                label: partialNode.label ?? "Nuevo elemento",
                type: partialNode.type ?? "custom",
                wattage: partialNode.wattage ?? null,
                notes: partialNode.notes ?? "",
                color: partialNode.color ?? palette[prev.length % palette.length],
                position: snapToGrid ? snapPosition(nextPosition) : nextPosition,
                meta: partialNode.meta ?? {}
            };

            return [...prev, node];
        });
        setSelectedNodeId(newId);
    }, [snapToGrid]);

    const moveNode = useCallback((nodeId, position) => {
        setNodes((prev) => prev.map((node) => (
            node.id === nodeId
                ? {
                    ...node,
                    position: snapToGrid ? snapPosition(position) : position
                }
                : node
        )));
    }, [snapToGrid]);

    const dropElement = useCallback((payload, position) => {
        if (!payload) {
            return;
        }

        addNode({
            label: payload.name ?? payload.model ?? "Elemento",
            type: payload.category ?? payload.type ?? "catálogo",
            wattage: payload.powerWatt ?? payload.powerConsumption ?? null,
            notes: payload.description ?? "",
            color: "#FDE68A",
            meta: payload
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
                        source: current,
                        target: nodeId,
                        label: ""
                    }];
                });
                setCurrentTool("select");
                return null;
            }

            return current === nodeId ? null : nodeId;
        });
    }, []);

    const doubleClickCanvas = useCallback((position) => {
        addNode({}, position);
    }, [addNode]);

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

    return (
        <section className="diagram-workspace">
            <DiagramToolbar
                onAddNode={() => addNode()}
                onClear={clearDiagram}
                currentTool={currentTool}
                onChangeTool={(tool) => {
                    setCurrentTool(tool);
                    setPendingConnectionId(null);
                }}
                zoom={zoom}
                onZoomChange={setZoom}
                snapToGrid={snapToGrid}
                onToggleSnap={() => setSnapToGrid((prev) => !prev)}
                onExport={exportDiagram}
                canDeleteSelection={Boolean(selectedNodeId)}
                onDeleteSelection={deleteSelectedNode}
                onDuplicateSelection={duplicateSelectedNode}
                stats={stats}
            />
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
                onCanvasDoubleClick={doubleClickCanvas}
                onDropElement={dropElement}
                onZoomChange={setZoom}
            />
        </section>
    );
}

export default DiagramWorkspace;
