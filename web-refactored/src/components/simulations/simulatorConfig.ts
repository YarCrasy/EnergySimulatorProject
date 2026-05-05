import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { FaBatteryHalf, FaIndustry, FaSolarPanel } from "react-icons/fa";

import type { CatalogKind, DayPeriodPreset, WeatherPreset } from "@components/simulations/simulatorTypes";

const palette = [
  "color-mix(in srgb, var(--accent-main) 24%, var(--surface-card))",
  "color-mix(in srgb, var(--accent-alt) 24%, var(--surface-card))",
  "color-mix(in srgb, #f7d56f 24%, var(--surface-card))",
  "color-mix(in srgb, #ff8f7c 18%, var(--surface-card))",
  "color-mix(in srgb, var(--text-high) 12%, var(--surface-card))",
];

export function nodeStyle(index: number): CSSProperties {
  return {
    "--node-bg": palette[index % palette.length],
    background: "transparent",
  } as CSSProperties;
}

export const numberFormat = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
export const tempDraftKey = "energy-simulator:temporary-draft";
export const autosaveDelayMs = 2000;
export const autosaveIntervalMs = 5 * 60 * 1000;

export const catalogKinds: Array<{ kind: CatalogKind; label: string; icon: IconType }> = [
  { kind: "generator", label: "Generadores", icon: FaSolarPanel },
  { kind: "consumer", label: "Consumidores", icon: FaIndustry },
  { kind: "storage", label: "Almacenadores", icon: FaBatteryHalf },
];

export const dayPeriodOptions: Array<{
  value: DayPeriodPreset;
  label: string;
  generationFactor: number;
  consumptionFactor: number;
  irradianceFactor: number;
}> = [
  { value: "madrugada", label: "Madrugada", generationFactor: 0.08, consumptionFactor: 0.82, irradianceFactor: 0.12 },
  { value: "mañana", label: "mañana", generationFactor: 0.72, consumptionFactor: 0.96, irradianceFactor: 0.7 },
  { value: "mediodia", label: "Mediodia", generationFactor: 1, consumptionFactor: 1.08, irradianceFactor: 1 },
  { value: "tarde", label: "Tarde", generationFactor: 0.62, consumptionFactor: 1.02, irradianceFactor: 0.58 },
  { value: "noche", label: "Noche", generationFactor: 0.14, consumptionFactor: 1.15, irradianceFactor: 0.18 },
];

export const weatherOptions: Array<{
  value: WeatherPreset;
  label: string;
  generationFactor: number;
  consumptionFactor: number;
  cloudCover: number;
  irradianceFactor: number;
}> = [
  { value: "soleado", label: "Soleado", generationFactor: 1, consumptionFactor: 0.98, cloudCover: 8, irradianceFactor: 1 },
  { value: "parcial", label: "Parcialmente nublado", generationFactor: 0.82, consumptionFactor: 1, cloudCover: 35, irradianceFactor: 0.84 },
  { value: "nublado", label: "Nublado", generationFactor: 0.58, consumptionFactor: 1.04, cloudCover: 72, irradianceFactor: 0.6 },
  { value: "lluvia", label: "Lluvia", generationFactor: 0.4, consumptionFactor: 1.08, cloudCover: 88, irradianceFactor: 0.42 },
  { value: "borrasca", label: "Borrasca", generationFactor: 0.24, consumptionFactor: 1.14, cloudCover: 97, irradianceFactor: 0.25 },
];
