import type { Identifier, LooseRecord } from "./common";

export interface EnergyElement extends LooseRecord {
  id?: Identifier | null;
  name?: string;
  elementType?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  brand?: string;
  area?: number | string | null;
  efficiency?: number | string | null;
  capacity?: number | string | null;
  initialCharge?: number | string | null;
  chargeRate?: number | string | null;
  dischargeRate?: number | string | null;
  baseConsumption?: number | string | null;
  peakConsumption?: number | string | null;
  profileType?: string | null;
  powerConsumption?: number | string | null;
  powerWatt?: number | string | null;
  x?: number | string | null;
  y?: number | string | null;
}
