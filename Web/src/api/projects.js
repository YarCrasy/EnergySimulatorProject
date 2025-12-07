
import api from './api';

const RESOURCE = '/projects';

const ensureArray = (data) => (Array.isArray(data) ? data : []);
const logError = (message, error) => {
  console.error(message, error);
};

export async function getAllProjects() {
  try {
    const { data } = await api.get(RESOURCE);
    return ensureArray(data);
  } catch (error) {
    logError('Error solicitando proyectos', error);
    return [];
  }
}

export async function getProjectById(id) {
  try {
    const { data } = await api.get(`${RESOURCE}/${id}`);
    return data;
  } catch (error) {
    logError('Error al obtener el proyecto', error);
    throw error;
  }
}

export async function createProject(projectData = {}) {
  try {
    const { data } = await api.post(RESOURCE, projectData);
    return data;
  } catch (error) {
    logError('Error creando proyecto', error);
    throw error;
  }
}

export async function deleteProject(id) {
  try {
    await api.delete(`${RESOURCE}/${id}`);
    return true;
  } catch (error) {
    logError('Error eliminando proyecto', error);
    throw error;
  }
}

