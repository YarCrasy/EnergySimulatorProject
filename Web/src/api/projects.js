import api from "./api";

const RESOURCE = "/projects";

export async function getAllProjects() {
  try {
    const { data } = await api.get(RESOURCE);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error solicitando proyectos", error);
    return [];
  }
}

export async function getProjectById(id) {
  if (!id) {
    throw new Error("getProjectById requiere un id");
  }

  const { data } = await api.get(`${RESOURCE}/${id}`);
  return data;
}

export async function createProject(projectData = {}) {
  try {
    const { data } = await api.post(RESOURCE, projectData);
    return data;
  } catch (error) {
    console.error("Error creando proyecto", error);
    throw error;
  }
}

export async function updateProject(id, projectData = {}) {
  if (!id) {
    throw new Error("updateProject requiere un id");
  }

  try {
    const { data } = await api.put(`${RESOURCE}/${id}`, projectData);
    return data;
  } catch (error) {
    console.error("Error actualizando proyecto", error);
    throw error;
  }
}

export async function deleteProject(id) {
  if (!id) {
    throw new Error("deleteProject requiere un id");
  }

  try {
    await api.delete(`${RESOURCE}/${id}`);
  } catch (error) {
    console.error("Error eliminando proyecto", error);
    throw error;
  }
}
