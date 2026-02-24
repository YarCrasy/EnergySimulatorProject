import api from './api';

const RESOURCE = '/projects';

export async function updateProject(id, projectData = {}) {
  if (!id) {
    throw new Error('updateProject requiere un id');
  }

  try {
    const { data } = await api.put(`${RESOURCE}/${id}`, projectData);
    return data;
  } catch (error) {
    console.error('Error actualizando el proyecto', error);
    throw error;
  }
}