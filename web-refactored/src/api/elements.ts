import api from "./api";
import type { Identifier } from "../models/common";
import type { EnergyElement } from "../models/element";

const resource = "/elements";

const fallbackElements: EnergyElement[] = [
  {
    id: "pv-default",
    name: "Panel fotovoltaico",
    elementType: "generator",
    category: "Generacion",
    powerWatt: 450,
    area: 2,
    efficiency: 21,
    description: "Modulo solar de referencia para empezar un proyecto.",
  },
  {
    id: "load-default",
    name: "Carga electrica",
    elementType: "consumer",
    category: "Consumo",
    powerConsumption: 1200,
    description: "Consumo base configurable.",
  },
  {
    id: "battery-default",
    name: "Bateria",
    elementType: "storage",
    category: "Almacenamiento",
    capacity: 5,
    initialCharge: 50,
    description: "Reserva energetica para suavizar el balance.",
  },
];

export async function getAllElements(): Promise<EnergyElement[]> {
  try {
    const { data } = await api.get<EnergyElement[]>(resource);
    return Array.isArray(data) && data.length > 0 ? data : fallbackElements;
  } catch (error) {
    console.error("Error solicitando elementos", error);
    return fallbackElements;
  }
}

export async function getElementById(id: Identifier): Promise<EnergyElement> {
  const { data } = await api.get<EnergyElement>(`${resource}/${id}`);
  return data;
}

export async function createElement(elementData: Partial<EnergyElement> = {}): Promise<EnergyElement> {
  const { data } = await api.post<EnergyElement>(resource, elementData);
  return data;
}
