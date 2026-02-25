import type { EntityId } from "./common.model";
import type { ElementModel } from "./element.model";

export interface PositionModel {
  x: number;
  y: number;
}

export interface DiagramNodeModel {
  id: string;
  backendId?: EntityId | null;
  elementId?: EntityId | null;
  label: string;
  type: string;
  wattage?: number | null;
  notes?: string;
  color: string;
  position: PositionModel;
  meta?: Partial<ElementModel> & Record<string, unknown>;
}

export interface DiagramConnectionModel {
  id: string;
  backendId?: EntityId | null;
  source: string;
  target: string;
  connectionType?: string;
  label?: string;
}

export interface SerializedDiagramModel {
  nodes: Array<{
    backendId: EntityId | null;
    elementId: EntityId | null;
    positionX: number;
    positionY: number;
  }>;
  connections: Array<{
    backendId: EntityId | null;
    source: string;
    target: string;
    connectionType: string;
  }>;
}
