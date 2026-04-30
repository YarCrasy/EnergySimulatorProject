import api from "./api";

export type ProjectDetail = {
  id?: string | number | null;
  name?: string;
  energyEnough?: boolean;
  energyNeeded?: number;
  userId?: string | number | null;
};

export type ProjectMutation = Partial<ProjectDetail>;

const resource = "/projects";

export async function createProject(projectData: ProjectMutation = {}): Promise<ProjectDetail> {
  try {
    const { data } = await api.post<ProjectDetail>(resource, projectData);
    return data;
  } catch (error) {
    console.error("Error creando proyecto", error);
    throw error;
  }
}
