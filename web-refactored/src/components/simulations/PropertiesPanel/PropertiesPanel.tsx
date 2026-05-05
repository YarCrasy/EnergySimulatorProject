import type { ProjectDetail } from "@models/project";

import { numberFormat } from "@components/simulations/simulatorConfig";
import type { EnergyNode, EnergyNodeData } from "@components/simulations/simulatorTypes";
import "./PropertiesPanel.css";

type PropertiesPanelProps = {
  project: ProjectDetail | null;
  totals: {
    generation: number;
    consumption: number;
    balance: number;
  };
  selectedNode: EnergyNode | null;
  onUpdateProjectField: (name: keyof ProjectDetail, value: string | number | boolean | null) => void;
  onUpdateSelectedNode: (patch: Partial<EnergyNodeData>) => void;
  onDeleteSelected: () => void;
};

export function PropertiesPanel({
  project,
  totals,
  selectedNode,
  onUpdateProjectField,
  onUpdateSelectedNode,
  onDeleteSelected,
}: PropertiesPanelProps) {
  return (
    <aside className="properties-panel">
      <section>
        <h2>Proyecto</h2>
        <div className="mini-stats">
          <article>
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
          Dia a simular
          <input type="date" value={project?.simulationDate ?? ""} onChange={(event) => onUpdateProjectField("simulationDate", event.target.value)} />
        </label>
        <label>
          Latitud
          <input type="number" value={project?.latitude ?? 28.1} onChange={(event) => onUpdateProjectField("latitude", Number(event.target.value))} />
        </label>
        <label>
          Longitud
          <input type="number" value={project?.longitude ?? -15.4} onChange={(event) => onUpdateProjectField("longitude", Number(event.target.value))} />
        </label>
        <label>
          Dias
          <input type="number" min="1" max="7" value={project?.durationDays ?? 1} onChange={(event) => onUpdateProjectField("durationDays", Number(event.target.value))} />
        </label>
        <label>
          Inclinacion
          <input type="number" value={project?.tiltAngle ?? 30} onChange={(event) => onUpdateProjectField("tiltAngle", Number(event.target.value))} />
        </label>
      </section>

      <section>
        <h2>Propiedades</h2>
        {selectedNode ? (
          <>
            <label>
              Nombre
              <input value={selectedNode.data.label} onChange={(event) => onUpdateSelectedNode({ label: event.target.value })} />
            </label>
            <label>
              Potencia W
              <input type="number" value={String(selectedNode.data.wattage ?? "")} onChange={(event) => onUpdateSelectedNode({ wattage: Number(event.target.value) })} />
            </label>
            <label>
              Cantidad
              <input type="number" min="1" value={selectedNode.data.quantity ?? 1} onChange={(event) => onUpdateSelectedNode({ quantity: Math.max(1, Number(event.target.value) || 1) })} />
            </label>
            <label>
              Notas
              <textarea value={selectedNode.data.notes ?? ""} onChange={(event) => onUpdateSelectedNode({ notes: event.target.value })} />
            </label>
            <button type="button" className="danger-button" onClick={onDeleteSelected}>
              Eliminar nodo
            </button>
          </>
        ) : (
          <p>Selecciona un nodo para editarlo.</p>
        )}
      </section>
    </aside>
  );
}
