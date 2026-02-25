import { useMemo, useRef } from "react";

import "./DiagramCanvas.css";

const clampZoom = (value) => Math.min(1.6, Math.max(0.4, value));

function DiagramCanvas({
    nodes,
    connections,
    selectedNodeId,
    pendingConnectionId,
    currentTool,
    zoom,
    onSelectNode,
    onClearSelection,
    onNodeMove,
    onRequestConnection,
    onDropElement,
    onZoomChange
}) {
    const boardRef = useRef(null);

    const nodeMap = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);

    const boardSize = useMemo(() => {
        if (!nodes.length) {
            return { width: 1600, height: 900 };
        }
        const maxX = Math.max(...nodes.map((node) => node.position.x)) + 200;
        const maxY = Math.max(...nodes.map((node) => node.position.y)) + 200;
        return {
            width: Math.max(1200, maxX),
            height: Math.max(800, maxY)
        };
    }, [nodes]);

    const getBoardCoords = (event) => {
        const element = boardRef.current;
        if (!element) {
            return { x: 0, y: 0 };
        }
        const rect = element.getBoundingClientRect();
        const scrollLeft = element.scrollLeft;
        const scrollTop = element.scrollTop;
        return {
            x: ((event.clientX - rect.left) + scrollLeft) / zoom,
            y: ((event.clientY - rect.top) + scrollTop) / zoom
        };
    };

    const startDrag = (event, nodeId) => {
        if (currentTool === "connect") {
            onSelectNode(nodeId);
            onRequestConnection(nodeId);
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        onSelectNode(nodeId);

        const origin = getBoardCoords(event);
        const node = nodeMap[nodeId];
        const offset = node
            ? {
                x: node.position.x - origin.x,
                y: node.position.y - origin.y
            }
            : { x: 0, y: 0 };

        const handleMove = (moveEvent) => {
            moveEvent.preventDefault();
            const coords = getBoardCoords(moveEvent);
            onNodeMove(nodeId, {
                x: coords.x + offset.x,
                y: coords.y + offset.y
            });
        };

        const handleUp = () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleUp);
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
    };

    const handleWheel = (event) => {
        if (!event.ctrlKey && !event.metaKey) {
            return;
        }
        event.preventDefault();
        const delta = event.deltaY < 0 ? 0.05 : -0.05;
        onZoomChange((prev) => clampZoom(prev + delta));
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const raw = event.dataTransfer.getData("application/json");
        if (!raw) {
            return;
        }
        let payload = null;
        try {
            payload = JSON.parse(raw);
        } catch (error) {
            console.warn("No se pudo leer el elemento arrastrado", error);
        }
        const coords = getBoardCoords(event);
        onDropElement(payload, coords);
    };

    return (
        <div
            className={`diagram-canvas tool-${currentTool}`}
            ref={boardRef}
            onWheel={handleWheel}
            onClick={onClearSelection}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
        >
            <div
                className="diagram-canvas-board"
                style={{
                    width: `${boardSize.width}px`,
                    height: `${boardSize.height}px`,
                    transform: `scale(${zoom})`
                }}
            >
                <svg
                    className="diagram-connections"
                    width={boardSize.width}
                    height={boardSize.height}
                >
                    {connections.map((connection) => {
                        const source = nodeMap[connection.source];
                        const target = nodeMap[connection.target];
                        if (!source || !target) {
                            return null;
                        }
                        const midX = (source.position.x + target.position.x) / 2;
                        const midY = (source.position.y + target.position.y) / 2 - 60;
                        const path = `M ${source.position.x} ${source.position.y} Q ${midX} ${midY} ${target.position.x} ${target.position.y}`;
                        return (
                            <path key={connection.id} d={path} />
                        );
                    })}
                </svg>

                {nodes.map((node) => (
                    <button
                        key={node.id}
                        type="button"
                        className={`diagram-node${selectedNodeId === node.id ? " selected" : ""}${pendingConnectionId === node.id ? " pending" : ""}`}
                        style={{
                            left: `${node.position.x}px`,
                            top: `${node.position.y}px`,
                            backgroundColor: node.color
                        }}
                        onPointerDown={(event) => startDrag(event, node.id)}
                        onClick={(event) => {
                            event.stopPropagation();
                            onSelectNode(node.id);
                        }}
                    >
                        <span className="node-label">{node.label}</span>
                        {node.wattage && (
                            <span className="node-wattage">{node.wattage} W</span>
                        )}
                        {node.meta?.name && (
                            <span className="node-meta">{node.meta.name}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DiagramCanvas;
