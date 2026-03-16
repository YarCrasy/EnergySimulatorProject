// src/api/elements.js
// Funciones para interactuar con los elementos (Panel, ConsumElement, etc.)

import api from './api';
import type { Identifier } from '@models/common';
import type { EnergyElement } from '@models/domain/element';

const RESOURCE = '/elements';

const FALLBACK_ELEMENTS: EnergyElement[] = [
    {
        "id": 1,
        "name": "Viva el consumismo",
        "x": 125.5,
        "y": 48.0,
        "project": null,
        "powerConsumption": 3.75
    },
    {
        "id": 2,
        "name": "Consumidor de consumos",
        "x": 0.0,
        "y": 0.0,
        "project": null,
        "powerConsumption": 100.0
    }
];

export async function getAllElements(): Promise<EnergyElement[]> {
  try {
    const { data } = await api.get<EnergyElement[]>(RESOURCE);
    if (!Array.isArray(data)) return FALLBACK_ELEMENTS;
    return data;
  } catch (error) {
    console.error('Error solicitando elementos', error);
    return FALLBACK_ELEMENTS;
  }
}

export async function getElementById(id: Identifier): Promise<EnergyElement> {
  const { data } = await api.get<EnergyElement>(`${RESOURCE}/${id}`);
  return data;
}

export async function createElement(elementData: Partial<EnergyElement> = {}): Promise<EnergyElement> {
  try {
    const { data } = await api.post<EnergyElement>(RESOURCE, elementData);
    return data;
  } catch (error) {
    console.error('Error creando elemento', error);
    throw error;
  }
}
