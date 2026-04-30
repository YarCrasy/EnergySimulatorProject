import api from "./api";
import type { Identifier } from "../models/common";
import type { ProjectDetail, ProjectMutation, ProjectSummary } from "../models/project";
import type { SimulationRun } from "../models/simulation";

const resource = "/projects";

function ensureArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  try {
    const { data } = await api.get<ProjectSummary[]>(resource);
    return ensureArray<ProjectSummary>(data);
  } catch (error) {
    console.error("Error solicitando proyectos", error);
    return [];
  }
}

export async function getProjectsByUser(userId: Identifier): Promise<ProjectSummary[]> {
  try {
    const { data } = await api.get<ProjectSummary[]>(`${resource}/user/${userId}`);
    return ensureArray<ProjectSummary>(data);
  } catch (error) {
    console.error("Error solicitando proyectos del usuario", error);
    return getAllProjects();
  }
}

export async function getProjectById(id: Identifier): Promise<ProjectDetail> {
  const { data } = await api.get<ProjectDetail>(`${resource}/${id}`);
  return data;
}

export async function createProject(projectData: ProjectMutation = {}): Promise<ProjectDetail> {
  try {
    const { data } = await api.post<ProjectDetail>(resource, projectData);
    return data;
  } catch (error) {
    console.error("Error creando proyecto", error);
    throw error;
  }
}

export async function updateProject(id: Identifier, projectData: ProjectMutation = {}): Promise<ProjectDetail> {
  const { data } = await api.put<ProjectDetail>(`${resource}/${id}`, projectData);
  return data;
}

export async function deleteProject(id: Identifier): Promise<true> {
  await api.delete(`${resource}/${id}`);
  return true;
}

export async function runProjectSimulation(id: Identifier, payload: ProjectMutation = {}): Promise<SimulationRun> {
  const { data } = await api.post<SimulationRun>(`${resource}/${id}/simulations`, payload);
  return data;
}
