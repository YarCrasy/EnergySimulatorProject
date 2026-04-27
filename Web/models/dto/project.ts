import type { Identifier, LooseRecord } from "../common";
import type { EnergyElement } from "../domain/element";

export interface ProjectConnectionEndpoint {
  id?: Identifier | null;
}

export interface ProjectNodeApi extends LooseRecord {
  id?: Identifier | null;
  positionX?: number | null;
  positionY?: number | null;
  type?: string;
  data?: string | LooseRecord | null;
  element?: EnergyElement | null;
  elementIdReference?: Identifier | null;
  elementId?: Identifier | null;
  element_id?: Identifier | null;
}

export interface ProjectConnectionApi extends LooseRecord {
  id?: Identifier | null;
  source?: ProjectConnectionEndpoint | null;
  target?: ProjectConnectionEndpoint | null;
  connectionType?: string;
}
