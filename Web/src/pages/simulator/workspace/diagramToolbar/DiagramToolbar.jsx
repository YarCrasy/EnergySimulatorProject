import "./DiagramToolbar.css";

const clampZoom = (value) => Math.min(1.6, Math.max(0.4, value));

function DiagramToolbar({
    onAddNode,
    onClear,
    currentTool,
    onChangeTool,
    zoom,
    onZoomChange,
    snapToGrid,
    onToggleSnap,
    onExport,
    canDeleteSelection,
    onDeleteSelection,
    onDuplicateSelection,
    stats
}) {
    return (
        <header className="diagram-toolbar">
            <div className="toolbar-group">
                <button type="button" className="primary" onClick={onAddNode}>
                    Añadir nodo
                </button>
                <button
                    type="button"
                    className={currentTool === "select" ? "active" : ""}
                    onClick={() => onChangeTool("select")}
                >
                    Seleccionar
                </button>
                <button
                    type="button"
                    className={currentTool === "connect" ? "active" : ""}
                    onClick={() => onChangeTool("connect")}
                >
                    Conectar
                </button>
            </div>

            <div className="toolbar-group">
                <button type="button" disabled={!canDeleteSelection} onClick={onDeleteSelection}>
                    Eliminar
                </button>
                <button type="button" disabled={!canDeleteSelection} onClick={onDuplicateSelection}>
                    Duplicar
                </button>
                <button type="button" onClick={onClear}>
                    Vaciar lienzo
                </button>
            </div>

            <div className="toolbar-group compact">
                <label>
                    Zoom
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={zoom}
                        onChange={(event) => onZoomChange(clampZoom(Number(event.target.value)))}
                    />
                </label>
                <div className="zoom-buttons">
                    <button type="button" onClick={() => onZoomChange((prev) => clampZoom(prev - 0.1))}>-</button>
                    <span>{Math.round(zoom * 100)}%</span>
                    <button type="button" onClick={() => onZoomChange((prev) => clampZoom(prev + 0.1))}>+</button>
                </div>
                <label className="toggle">
                    <input type="checkbox" checked={snapToGrid} onChange={onToggleSnap} />
                    Rejilla
                </label>
            </div>

            <div className="toolbar-group">
                <div className="stats">
                    <span>{stats.nodes} nodos</span>
                    <span>{stats.connections} enlaces</span>
                    <span>{Math.round(stats.totalWattage)} W</span>
                </div>
                <button type="button" onClick={onExport}>
                    Exportar JSON
                </button>
            </div>
        </header>
    );
}

export default DiagramToolbar;
