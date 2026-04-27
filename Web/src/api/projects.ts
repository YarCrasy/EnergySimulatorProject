import api from './api';
import type { Identifier } from '@models/common';
import type { ProjectDetail, ProjectMutation, ProjectSummary } from '@models/domain/project';

const RESOURCE = '/projects';

const ensureArray = <T>(data: unknown): T[] => (Array.isArray(data) ? (data as T[]) : []);
const logError = (message: string, error: unknown) => {
  console.error(message, error);
};

export async function getAllProjects(): Promise<ProjectSummary[]> {
  try {
    const { data } = await api.get<ProjectSummary[]>(RESOURCE);
    return ensureArray<ProjectSummary>(data);
  } catch (error) {
    logError('Error solicitando proyectos', error);
    return [];
  }
}

export async function getProjectById(id: Identifier): Promise<ProjectDetail> {
  try {
    const { data } = await api.get<ProjectDetail>(`${RESOURCE}/${id}`);
    return data;
  } catch (error) {
    logError('Error al obtener el proyecto', error);
    throw error;
  }
}

export async function createProject(projectData: ProjectMutation = {}): Promise<ProjectDetail> {
  try {
    const { data } = await api.post<ProjectDetail>(RESOURCE, projectData);
    return data;
  } catch (error) {
    logError('Error creando proyecto', error);
    throw error;
  }
}

export async function deleteProject(id: Identifier): Promise<true> {
  try {
    await api.delete(`${RESOURCE}/${id}`);
    return true;
  } catch (error) {
    logError('Error eliminando proyecto', error);
    throw error;
  }
}

export async function updateProject(id: Identifier, projectData: ProjectMutation = {}): Promise<ProjectDetail> {
  if (!id) {
    throw new Error('updateProject requiere un id');
  }
  try {
    const { data } = await api.put<ProjectDetail>(`${RESOURCE}/${id}`, projectData);
    return data;
  } catch (error) {
    logError('Error actualizando el proyecto', error);
    throw error;
  }
}
