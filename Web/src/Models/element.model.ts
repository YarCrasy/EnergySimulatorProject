import type { EntityId } from "./common.model";
import { toFiniteNumber } from "./common.model";

export interface ElementModel {
  id: EntityId;
  name: string;
  description?: string;
  category?: string;
  elementType?: string;
  powerWatt?: number;
  powerConsumption?: number;
  x?: number;
  y?: number;
  project?: unknown;
}

export function resolveElementWattage(element?: Partial<ElementModel> | null) {
  const rawValue = element?.powerWatt ?? element?.powerConsumption;
  const numeric = toFiniteNumber(rawValue, NaN);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.round(numeric * 100) / 100;
}
