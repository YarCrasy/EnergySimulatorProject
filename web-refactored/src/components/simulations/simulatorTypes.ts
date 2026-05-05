import type { Edge, Node } from "@xyflow/react";

import type { Identifier } from "@models/common";
import type { EnergyElement } from "@models/element";

export type EnergyNodeData = {
  backendId?: Identifier | null;
  elementId?: Identifier | null;
  label: string;
  typeLabel: string;
  wattage?: number | string | null;
  quantity?: number;
  notes?: string;
  element?: EnergyElement | null;
};

export type EnergyNode = Node<EnergyNodeData>;
export type EnergyEdge = Edge<{ backendId?: Identifier | null; connectionType?: string }>;
export type CatalogKind = "generator" | "consumer" | "storage";
export type DayPeriodPreset = "madrugada" | "manana" | "mediodia" | "tarde" | "noche";
export type WeatherPreset = "soleado" | "parcial" | "nublado" | "lluvia" | "borrasca";
