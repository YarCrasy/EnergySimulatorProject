// src/api/projects.js
// Funciones para interactuar con la API REST de proyectos

import api from './api';

const RESOURCE = '/projects';

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
    const { data } = await api.get(RESOURCE);
    if (!Array.isArray(data)) return FALLBACK_PROJECTS;
    return data;
  } catch (error) {
    console.error('Error solicitando proyectos', error);
    return FALLBACK_PROJECTS;
  }
}

export async function getProjectById(id) {
  const { data } = await api.get(`${RESOURCE}/${id}`);
  return data;
}

export async function createProject(projectData = {}) {
  try {
    const { data } = await api.post(RESOURCE, projectData);
    return data;
  } catch (error) {
    console.error('Error creando proyecto', error);
    throw error;
  }
}

