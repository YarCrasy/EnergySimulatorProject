import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FaPlay, FaSave } from "react-icons/fa";

import { CatalogPanel, EnergyNodeCard, PropertiesPanel, useSimulatorPage } from "@components/simulations";
import "./Simulator.css";

const nodeTypes = {
  energy: EnergyNodeCard,
};

function SimulatorInner() {
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
    environmentDayPeriod,
    environmentWeather,
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
        environmentDayPeriod={environmentDayPeriod}
        environmentWeather={environmentWeather}
        selectedNode={selectedNode}
        simulation={adjustedSimulation}
        onUpdateProjectField={updateProjectField}
        onUpdateSelectedNode={updateSelectedNode}
        onDeleteSelected={deleteSelected}
      />
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
