// src/api/elements.js
// Funciones para interactuar con los elementos (Panel, ConsumElement, etc.)

import api from './api';

const RESOURCE = '/elements';

const FALLBACK_ELEMENTS = [
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

export async function getAllElements() {
  try {
    const { data } = await api.get(RESOURCE);
    if (!Array.isArray(data)) return FALLBACK_ELEMENTS;
    return data;
  } catch (error) {
    console.error('Error solicitando elementos', error);
    return FALLBACK_ELEMENTS;
  }
}

export async function getElementById(id) {
  const { data } = await api.get(`${RESOURCE}/${id}`);
  return data;
}

export async function createElement(elementData = {}) {
  try {
    const { data } = await api.post(RESOURCE, elementData);
    return data;
  } catch (error) {
    console.error('Error creando elemento', error);
    throw error;
  }
}
