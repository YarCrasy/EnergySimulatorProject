// src/api/elements.js
// Funciones para interactuar con los elementos (Panel, ConsumElement, etc.)

const API_URL = 'http://localhost:8080/api/elements';

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
    const response = await fetch(API_URL);
    if (!response.ok) return FALLBACK_ELEMENTS;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return FALLBACK_ELEMENTS;

    return await response.json();
  } catch (error) {
    console.error('Error solicitando elementos', error);
    return FALLBACK_ELEMENTS;
  }
}

export async function getElementById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Error al obtener el elemento');
  return response.json();
}

export async function createElement(elementData = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elementData),
    });

    if (!response.ok) throw new Error('Error al crear el elemento');

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Respuesta inválida al crear el elemento');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creando elemento', error);
    throw error;
  }
}
