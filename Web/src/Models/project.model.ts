import type { EntityId, TimestampValue } from "./common.model";
import type { ElementModel } from "./element.model";

export interface ProjectNodeReference {
  id: EntityId;
}

export interface ProjectNodeModel {
  id?: EntityId | null;
  element?: ElementModel;
  elementId?: EntityId;
  elementIdReference?: EntityId;
  positionX: number;
  positionY: number;
}

export interface ProjectConnectionModel {
  id?: EntityId | null;
  connectionType?: string;
  source: ProjectNodeReference;
  target: ProjectNodeReference;
}

export interface ProjectModel {
  id: EntityId;
  name: string;
  title?: string;
  userId: EntityId;
  energyNeeded: number;
  energyEnough: boolean;
  imageUrl?: string;
  updatedAt?: TimestampValue;
  lastUpdated?: TimestampValue;
  projectNodes?: ProjectNodeModel[];
  nodeConnections?: ProjectConnectionModel[];
}

export interface ProjectPayload {
  id?: EntityId;
  name: string;
  userId: EntityId;
  energyNeeded: number;
  energyEnough: boolean;
  projectNodes?: ProjectNodeModel[];
  nodeConnections?: ProjectConnectionModel[];
}

export const DEFAULT_PROJECT_NAME = "Nuevo Proyecto";

export function buildNewProjectPayload(userId: EntityId, name = DEFAULT_PROJECT_NAME): ProjectPayload {
  return {
    name,
    energyEnough: false,
    energyNeeded: 0,
    userId,
  };
}

export function resolveProjectTitle(project?: Partial<ProjectModel> | null) {
  if (!project) {
    return "";
  }
  return project.name || project.title || `Proyecto ${project.id ?? ""}`.trim();
}

export function resolveProjectLastUpdated(project?: Partial<ProjectModel> | null) {
  if (!project) {
    return null;
  }
  return project.updatedAt ?? project.lastUpdated ?? null;
}
