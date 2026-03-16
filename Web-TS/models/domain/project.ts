import type { Identifier, LooseRecord } from "../common";
import type { ProjectConnectionApi, ProjectNodeApi } from "../dto/project";

export interface ProjectSummary extends LooseRecord {
  id?: Identifier | null;
  name?: string;
  title?: string;
  energyNeeded?: number;
  energyEnough?: boolean;
  userId?: Identifier | null;
  updatedAt?: string;
  lastUpdated?: string;
  imageUrl?: string;
}

export interface ProjectDetail extends ProjectSummary {
  projectNodes?: ProjectNodeApi[];
  nodeConnections?: ProjectConnectionApi[];
}

export type ProjectMutation = Partial<ProjectDetail>;
