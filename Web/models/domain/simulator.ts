import type { Identifier, LooseRecord } from "../common";
import type { ProjectDetail } from "./project";

export interface DiagramPosition {
  x: number;
  y: number;
}

export interface DiagramNode extends LooseRecord {
  id: string;
  backendId?: Identifier | null;
  elementId?: Identifier | null;
  label: string;
  type: string;
  wattage?: number | string | null;
  notes: string;
  color: string;
  position: DiagramPosition;
  meta?: LooseRecord;
  simulationData?: LooseRecord | null;
}

export interface DiagramConnection extends LooseRecord {
  id: string;
  backendId?: Identifier | null;
  source: string;
  target: string;
  connectionType?: string;
  label?: string;
}

export type DiagramProjectData = ProjectDetail;
