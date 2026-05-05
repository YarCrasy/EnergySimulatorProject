import { useEffect, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FaChartLine, FaPlay, FaSave, FaTimes } from "react-icons/fa";

import { CatalogPanel, EnergyNodeCard, PropertiesPanel, SimulationPanel, useSimulatorPage } from "@components/simulations";
import "./Simulator.css";

const nodeTypes = {
  energy: EnergyNodeCard,
};

function SimulatorInner() {
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const {
    addElement,
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
  } = useSimulatorPage();

  useEffect(() => {
    if (!isResultsModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsResultsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResultsModalOpen]);

  return (
    <main className="simulator-page">
      <CatalogPanel
        catalogStatus={catalogStatus}
        catalogSearch={catalogSearch}
        catalogSearchTerm={catalogSearchTerm}
        selectedCatalogKind={selectedCatalogKind}
        catalogModeTitle={catalogModeTitle}
        visibleCatalog={visibleCatalog}
        catalogCounts={catalogCounts}
        onCatalogSearchChange={setCatalogSearch}
        onSelectCatalogKind={setSelectedCatalogKind}
        onAddElement={addElement}
      />

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
            <button type="button" onClick={() => setIsResultsModalOpen(true)} disabled={!adjustedSimulation || loading}>
              <FaChartLine aria-hidden="true" />
              {adjustedSimulation ? "Resultados" : "Sin resultados"}
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

      <PropertiesPanel
        project={project}
        totals={totals}
        selectedNode={selectedNode}
        onUpdateProjectField={updateProjectField}
        onUpdateSelectedNode={updateSelectedNode}
        onDeleteSelected={deleteSelected}
      />

      {isResultsModalOpen && adjustedSimulation ? (
        <div className="simulation-modal" role="dialog" aria-modal="true" aria-labelledby="simulation-results-title">
          <div className="simulation-modal-backdrop" aria-hidden="true" onClick={() => setIsResultsModalOpen(false)} />
          <div className="simulation-modal-content">
            <div className="simulation-modal-header">
              <h2 id="simulation-results-title">Resultados de la simulacion</h2>
              <button type="button" className="simulation-modal-close" onClick={() => setIsResultsModalOpen(false)}>
                <FaTimes aria-hidden="true" />
                Cerrar
              </button>
            </div>
            <SimulationPanel simulation={adjustedSimulation} />
          </div>
        </div>
      ) : null}
    </main>
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
