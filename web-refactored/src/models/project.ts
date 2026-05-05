import type { EnergyElement } from "./element";
import type { Identifier, LooseRecord } from "./common";

export interface ProjectNodeApi extends LooseRecord {
  id?: Identifier | null;
  element?: EnergyElement | { id?: Identifier | null } | null;
  elementIdReference?: Identifier | null;
  positionX?: number | null;
  positionY?: number | null;
  type?: string | null;
  quantity?: number | null;
  data?: string | LooseRecord | null;
}

export interface ProjectConnectionApi extends LooseRecord {
  id?: Identifier | null;
  source?: { id?: Identifier | null } | null;
  target?: { id?: Identifier | null } | null;
  connectionType?: string | null;
}

export interface ProjectSummary extends LooseRecord {
  id?: Identifier | null;
  name?: string;
  title?: string;
  season?: string;
  dayPeriodPreset?: string;
  weatherPreset?: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  tiltAngle?: number | null;
  azimuth?: number | null;
  durationDays?: number | null;
  simulationMode?: string | null;
  systemLossPercent?: number | null;
  energyEnough?: boolean;
  energyNeeded?: number;
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
