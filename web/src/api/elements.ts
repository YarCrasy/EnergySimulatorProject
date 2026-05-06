import api from "./api";
import type { Identifier } from "../models/common";
import type { EnergyElement } from "../models/element";

const resource = "/elements";

type ElementTypeValue = EnergyElement["elementType"] | EnergyElement["category"] | string | null | undefined;

function normalizeElementType(type: ElementTypeValue): "generator" | "consumer" | "battery" {
  const normalized = String(type ?? "")
    .trim()
    .toLowerCase();

  if (normalized.includes("generator") || normalized.includes("gener")) return "generator";
  if (normalized.includes("battery") || normalized.includes("storage") || normalized.includes("almacen")) return "battery";
  return "consumer";
}

function resolveScopedResource(type: ElementTypeValue): string {
  const normalizedType = normalizeElementType(type);

  if (normalizedType === "generator") return "/generator-elements";
  if (normalizedType === "battery") return "/battery-elements";
  return "/consumer-element";
}

function ensureIdentifier(id: Identifier | null | undefined, action: string): Identifier {
  if (id == null) {
    throw new Error(`${action} requiere un id`);
  }

  return id;
}

export async function getAllElements(): Promise<EnergyElement[]> {
  try {
    const { data } = await api.get<EnergyElement[]>(resource);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error solicitando elementos", error);
    throw error;
  }
}

export async function getElementById(id: Identifier): Promise<EnergyElement> {
  const safeId = ensureIdentifier(id, "getElementById");
  const { data } = await api.get<EnergyElement>(`/consumer-element/${safeId}`);
  return data;
}

export async function createElement(elementData: Partial<EnergyElement> = {}): Promise<EnergyElement> {
  const payload: Partial<EnergyElement> = {
    ...elementData,
    elementType: normalizeElementType(elementData.elementType ?? elementData.category),
  };
  const { data } = await api.post<EnergyElement>(resource, payload);
  return data;
}

export async function updateElement(id: Identifier, elementData: Partial<EnergyElement> = {}): Promise<EnergyElement> {
  const safeId = ensureIdentifier(id, "updateElement");
  const scopedResource = resolveScopedResource(elementData.elementType ?? elementData.category);
  const payload: Partial<EnergyElement> = {
    ...elementData,
    elementType: normalizeElementType(elementData.elementType ?? elementData.category),
  };
  const { data } = await api.put<EnergyElement>(`${scopedResource}/${safeId}`, payload);
  return data;
}

export async function deleteElement(id: Identifier, element: Partial<EnergyElement> | ElementTypeValue = "consumer"): Promise<void> {
  const safeId = ensureIdentifier(id, "deleteElement");
  const scopedResource =
    typeof element === "string" || element == null
      ? resolveScopedResource(element)
      : resolveScopedResource(element.elementType ?? element.category);

  await api.delete(`${scopedResource}/${safeId}`);
}
