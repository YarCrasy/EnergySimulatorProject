import type { Identifier, LooseRecord } from "../common";

export interface EnergyElement extends LooseRecord {
  id?: Identifier | null;
  name?: string;
  x?: number | string | null;
  y?: number | string | null;
  project?: Identifier | LooseRecord | null;
  brand?: string;
  area?: number | string | null;
  efficiency?: number | string | null;
  capacity?: number | string | null;
  initialCharge?: number | string | null;
  chargeRate?: number | string | null;
  dischargeRate?: number | string | null;
  baseConsumption?: number | string | null;
  powerConsumption?: number | string | null;
  powerWatt?: number | string | null;
  elementType?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
}
