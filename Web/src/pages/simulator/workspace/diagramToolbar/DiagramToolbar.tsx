import "./DiagramToolbar.css";

const clampZoom = (value) => Math.min(1.6, Math.max(0.4, value));

function DiagramToolbar({
    onClear,
    currentTool,
    onChangeTool,
    zoom,
    onZoomChange,
    onExport,
    canDeleteSelection,
    onDeleteSelection,
    onDuplicateSelection,
    stats,
    onSave,
    canSave,
    saving,
    hasChanges,
    statusMessage,
    loadingProject
}) {
    const saveDisabled = !canSave || saving || loadingProject || !hasChanges;
    return (
        <header className="diagram-toolbar">
            <div className="toolbar-group">
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
            </div>

            <div className="toolbar-group">
                <button
                    type="button"
                    className="primary subtle"
                    disabled={saveDisabled}
                    onClick={onSave}
                >
                    {saving ? "Guardando..." : hasChanges ? "Guardar cambios" : "Sin cambios"}
                </button>
                <div className="stats">
                    <span>{stats.nodes} nodos</span>
                    <span>{stats.connections} enlaces</span>
                    <span>{Math.round(stats.totalWattage)} W</span>
                </div>
                <button type="button" onClick={onExport}>
                    Exportar JSON
                </button>
                {statusMessage && (
                    <span className="toolbar-status">{statusMessage}</span>
                )}
            </div>
        </header>
    );
}

export default DiagramToolbar;
