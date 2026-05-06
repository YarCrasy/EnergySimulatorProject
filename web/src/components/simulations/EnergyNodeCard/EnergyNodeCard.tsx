import { Handle, Position } from "@xyflow/react";

import type { EnergyNodeData } from "@components/simulations/simulatorTypes";
import "./EnergyNodeCard.css";

export function EnergyNodeCard({ data, selected }: { data: EnergyNodeData; selected?: boolean }) {
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
