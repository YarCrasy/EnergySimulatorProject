import { asNumber, type Identifier, type LooseRecord } from "@models/common";
import type { EnergyElement } from "@models/element";
import type { ProjectDetail, ProjectMutation, ProjectNodeApi } from "@models/project";
import type { SimulationRun } from "@models/simulation";

import { dayPeriodOptions, nodeStyle, tempDraftKey, weatherOptions } from "@components/simulations/simulatorConfig";
import type { CatalogKind, DayPeriodPreset, EnergyEdge, EnergyNode, EnergyNodeData, WeatherPreset } from "@components/simulations/simulatorTypes";

export type SimulatorDraft = {
  project: ProjectDetail;
  nodes: EnergyNode[];
  edges: EnergyEdge[];
};

export function createTemporaryProject(): ProjectDetail {
  return {
    name: "Simulacion temporal",
    season: "verano",
    dayPeriodPreset: "mediodia",
    weatherPreset: "soleado",
    latitude: 28.1,
    longitude: -15.4,
    timezone: "auto",
    tiltAngle: 30,
    azimuth: 0,
    durationDays: 1,
    simulationMode: "open-meteo",
    systemLossPercent: 14,
    energyEnough: false,
    energyNeeded: 0,
    projectNodes: [],
    nodeConnections: [],
  };
}

export function withEnvironmentDefaults(project: ProjectDetail): ProjectDetail {
  return {
    ...project,
    dayPeriodPreset: (project.dayPeriodPreset as DayPeriodPreset | undefined) ?? "mediodia",
    weatherPreset: (project.weatherPreset as WeatherPreset | undefined) ?? "soleado",
  };
}

export function readTemporaryDraft(): SimulatorDraft | null {
  try {
    const stored = localStorage.getItem(tempDraftKey);
    return stored ? (JSON.parse(stored) as SimulatorDraft) : null;
  } catch {
    return null;
  }
}

export function writeTemporaryDraft(project: ProjectDetail, nodes: EnergyNode[], edges: EnergyEdge[]) {
  localStorage.setItem(tempDraftKey, JSON.stringify({ project, nodes, edges }));
}

export function parseData(value: unknown): LooseRecord {
  if (!value) {
    return {};
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? (parsed as LooseRecord) : {};
    } catch {
      return {};
    }
  }
  return typeof value === "object" ? (value as LooseRecord) : {};
}

export function resolveElementId(node: ProjectNodeApi | EnergyNode): Identifier | null {
  if ("position" in node) {
    return (node as EnergyNode).data.elementId ?? null;
  }

  const apiNode = node as ProjectNodeApi;
  const element = apiNode.element as EnergyElement | undefined | null;
  const value = element?.id ?? apiNode.elementIdReference ?? null;
  return typeof value === "string" || typeof value === "number" ? value : null;
}

export function nodePower(element?: EnergyElement | null, data?: LooseRecord) {
  const value = data?.powerWatt ?? data?.powerConsumption ?? data?.baseConsumption ?? element?.powerWatt ?? element?.powerConsumption ?? element?.capacity ?? null;
  return typeof value === "string" || typeof value === "number" ? value : null;
}

export function isGenerator(element?: EnergyElement | null, data?: EnergyNodeData) {
  const text = `${element?.elementType ?? ""} ${element?.category ?? ""} ${data?.typeLabel ?? ""}`.toLowerCase();
  return text.includes("generator") || text.includes("generacion") || text.includes("solar") || text.includes("panel");
}

export function elementSearchText(element: EnergyElement) {
  return [
    element.name,
    element.elementType,
    element.category,
    element.description,
    element.brand,
    element.profileType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function elementKind(element: EnergyElement): CatalogKind {
  const text = elementSearchText(element);
  if (text.includes("storage") || text.includes("almacen") || text.includes("bater")) {
    return "storage";
  }
  if (text.includes("consumer") || text.includes("consumo") || text.includes("carga") || text.includes("factory") || text.includes("resid")) {
    return "consumer";
  }
  return "generator";
}

export function buildNodes(project: ProjectDetail, catalog: EnergyElement[]): EnergyNode[] {
  const catalogById = new Map(catalog.map((element) => [String(element.id), element]));
  return (project.projectNodes ?? []).map((node, index) => {
    const elementId = resolveElementId(node);
    const element = elementId == null ? null : catalogById.get(String(elementId)) ?? (node.element as EnergyElement | null);
    const data = parseData(node.data);
    return {
      id: node.id ? `node-${node.id}` : `node-local-${index}`,
      type: "energy",
      position: {
        x: asNumber(node.positionX, 160 + index * 36),
        y: asNumber(node.positionY, 140 + index * 34),
      },
      data: {
        backendId: node.id ?? null,
        elementId,
        label: String(data.label ?? element?.name ?? `Nodo ${index + 1}`),
        typeLabel: String(node.type ?? element?.elementType ?? element?.category ?? "Elemento"),
        wattage: nodePower(element, data),
        quantity: Math.max(1, asNumber(node.quantity ?? data.quantity, 1)),
        notes: String(data.notes ?? ""),
        element,
      },
      style: nodeStyle(index),
    };
  });
}

export function buildEdges(project: ProjectDetail, nodes: EnergyNode[]): EnergyEdge[] {
  const byBackendId = new Map(nodes.map((node) => [String(node.data.backendId), node.id]));
  const result: EnergyEdge[] = [];
  (project.nodeConnections ?? []).forEach((connection) => {
    const source = byBackendId.get(String(connection.source?.id));
    const target = byBackendId.get(String(connection.target?.id));
    if (!source || !target) return;
    result.push({
      id: connection.id ? `edge-${connection.id}` : `edge-${source}-${target}`,
      source,
      target,
      label: connection.connectionType ?? "",
      data: { backendId: connection.id ?? null, connectionType: connection.connectionType ?? "" },
    });
  });
  return result;
}

export function buildProjectPayload(project: ProjectDetail, nodes: EnergyNode[], edges: EnergyEdge[]): ProjectMutation {
  const projectNodes = nodes
    .filter((node) => node.data.elementId != null)
    .map((node) => ({
      id: node.data.backendId ?? null,
      element: { id: node.data.elementId },
      positionX: Math.round(node.position.x * 100) / 100,
      positionY: Math.round(node.position.y * 100) / 100,
      type: node.data.typeLabel,
      quantity: Math.max(1, asNumber(node.data.quantity, 1)),
      data: JSON.stringify({
        label: node.data.label,
        notes: node.data.notes ?? "",
        powerWatt: node.data.wattage,
        quantity: Math.max(1, asNumber(node.data.quantity, 1)),
      }),
    }));

  const backendByNodeId = new Map(nodes.map((node) => [node.id, node.data.backendId]));
  const nodeConnections = edges
    .map((edge) => {
      const sourceId = backendByNodeId.get(edge.source);
      const targetId = backendByNodeId.get(edge.target);
      if (!sourceId || !targetId) {
        return null;
      }
      return {
        id: edge.data?.backendId ?? null,
        source: { id: sourceId },
        target: { id: targetId },
        connectionType: edge.data?.connectionType ?? "",
      };
    })
    .filter(Boolean) as NonNullable<ProjectMutation["nodeConnections"]>;

  return {
    id: project.id,
    name: project.name,
    season: project.season,
    latitude: project.latitude,
    longitude: project.longitude,
    timezone: project.timezone,
    tiltAngle: project.tiltAngle,
    azimuth: project.azimuth,
    durationDays: project.durationDays,
    simulationMode: project.simulationMode,
    systemLossPercent: project.systemLossPercent,
    energyNeeded: project.energyNeeded,
    energyEnough: project.energyEnough,
    userId: project.userId,
    projectNodes,
    nodeConnections,
  };
}

export function attachBackendIds(nodes: EnergyNode[], updated: ProjectDetail) {
  const remaining = [...(updated.projectNodes ?? [])];
  return nodes.map((node) => {
    if (node.data.backendId) {
      return node;
    }
    const matchIndex = remaining.findIndex((apiNode) => String(resolveElementId(apiNode)) === String(node.data.elementId));
    const match = matchIndex >= 0 ? remaining.splice(matchIndex, 1)[0] : null;
    return match?.id ? { ...node, data: { ...node.data, backendId: match.id } } : node;
  });
}

export function getDayPeriodConfig(value?: string | null) {
  return dayPeriodOptions.find((option) => option.value === value) ?? dayPeriodOptions[2];
}

export function getWeatherConfig(value?: string | null) {
  return weatherOptions.find((option) => option.value === value) ?? weatherOptions[0];
}

export function applyEnvironmentToSimulation(simulation: SimulationRun | null, project: ProjectDetail | null): SimulationRun | null {
  if (!simulation || !project) {
    return simulation;
  }

  const dayPeriod = getDayPeriodConfig(project.dayPeriodPreset);
  const weather = getWeatherConfig(project.weatherPreset);
  const generationFactor = dayPeriod.generationFactor * weather.generationFactor;
  const consumptionFactor = dayPeriod.consumptionFactor * weather.consumptionFactor;
  const irradianceFactor = dayPeriod.irradianceFactor * weather.irradianceFactor;

  const points = (simulation.points ?? []).map((point) => {
    const generationW = asNumber(point.generationW) * generationFactor;
    const consumptionW = asNumber(point.consumptionW) * consumptionFactor;
    return {
      ...point,
      generationW,
      consumptionW,
      balanceW: generationW - consumptionW,
      cloudCover: weather.cloudCover,
      irradiance: Math.round(asNumber(point.irradiance, 1000) * irradianceFactor * 100) / 100,
      day: generationFactor > 0.18,
    };
  });

  const totalGenerationKwh = points.reduce((sum, point) => sum + asNumber(point.generationW) / 1000, 0);
  const totalConsumptionKwh = points.reduce((sum, point) => sum + asNumber(point.consumptionW) / 1000, 0);
  const deficitKwh = Math.max(0, totalConsumptionKwh - totalGenerationKwh);
  const surplusKwh = Math.max(0, totalGenerationKwh - totalConsumptionKwh);
  const selfSufficiencyPercent = totalConsumptionKwh > 0 ? Math.min(100, (totalGenerationKwh / totalConsumptionKwh) * 100) : 100;

  return {
    ...simulation,
    totalGenerationKwh: Math.round(totalGenerationKwh * 100) / 100,
    totalConsumptionKwh: Math.round(totalConsumptionKwh * 100) / 100,
    deficitKwh: Math.round(deficitKwh * 100) / 100,
    surplusKwh: Math.round(surplusKwh * 100) / 100,
    selfSufficiencyPercent: Math.round(selfSufficiencyPercent * 100) / 100,
    energyEnough: totalGenerationKwh >= totalConsumptionKwh,
    points,
  };
}
