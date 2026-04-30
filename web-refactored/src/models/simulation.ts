export interface SimulationPoint {
  id?: number | string | null;
  timestamp?: string | null;
  generationW?: number | null;
  consumptionW?: number | null;
  balanceW?: number | null;
  deficitKwh?: number | null;
  surplusKwh?: number | null;
  cloudCover?: number | null;
  irradiance?: number | null;
  day?: boolean;
}

export interface SimulationRun {
  id?: number | string | null;
  createdAt?: string | null;
  provider?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  durationDays?: number | null;
  tiltAngle?: number | null;
  azimuth?: number | null;
  totalGenerationKwh?: number | null;
  totalConsumptionKwh?: number | null;
  deficitKwh?: number | null;
  surplusKwh?: number | null;
  selfSufficiencyPercent?: number | null;
  energyEnough?: boolean;
  points?: SimulationPoint[];
}
