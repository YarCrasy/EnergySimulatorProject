// src/api/projects.js
// Funciones para interactuar con la API REST de proyectos

const API_URL = 'https://dam-project.yarcrasy.com/api/projects';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'Proyecto Solar 1',
    lastUpdated: '2024-01-15',
  },
  {
    id: 2,
    title: 'Proyecto Eólico 2',
    lastUpdated: '2024-02-20',
  },
  {
    id: 3,
    title: 'Proyecto Hidroeléctrico 3',
    lastUpdated: '2024-03-10',
  },
];

export async function getAllProjects() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) return FALLBACK_PROJECTS;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return FALLBACK_PROJECTS;

    return await response.json();
  } catch (error) {
    console.error('Error solicitando proyectos', error);
    return FALLBACK_PROJECTS;
  }
}

export async function getProjectById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Error al obtener el proyecto');
  return response.json();
}

export async function createProject(projectData = {}) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) throw new Error('Error al crear el proyecto');

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Respuesta inválida al crear el proyecto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creando proyecto', error);
    throw error;
  }
}

