import type { Identifier, LooseRecord } from "../common";

export interface EnergyElement extends LooseRecord {
  id?: Identifier | null;
  name?: string;
  x?: number | string | null;
  y?: number | string | null;
  project?: Identifier | LooseRecord | null;
  powerConsumption?: number | string | null;
  powerWatt?: number | string | null;
  elementType?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
}
