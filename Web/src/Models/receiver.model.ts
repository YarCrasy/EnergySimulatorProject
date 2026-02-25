import type { EntityId } from "./common.model";
import { toFiniteNumber } from "./common.model";

export interface ReceiverModel {
  id: EntityId;
  name: string;
  powerConsumption: number;
  x?: number | null;
  y?: number | null;
  project?: unknown;
}

export interface ReceiverPayload {
  id?: EntityId;
  name: string;
  powerConsumption: number;
  x: number;
  y: number;
}

export interface ReceiverFormModel {
  name: string;
  powerConsumption: string;
  x: string;
  y: string;
}

export const EMPTY_RECEIVER_FORM: ReceiverFormModel = {
  name: "",
  powerConsumption: "",
  x: "",
  y: "",
};

function numberToFormValue(value?: number | null) {
  return value ? String(value) : "";
}

export function toReceiverFormModel(receiver?: Partial<ReceiverModel> | null): ReceiverFormModel {
  if (!receiver) {
    return { ...EMPTY_RECEIVER_FORM };
  }

  return {
    name: receiver.name || "",
    powerConsumption: numberToFormValue(receiver.powerConsumption),
    x: numberToFormValue(receiver.x),
    y: numberToFormValue(receiver.y),
  };
}

export function buildReceiverPayload(
  form: ReceiverFormModel,
  receiverToEdit?: Partial<ReceiverModel> | null,
): ReceiverPayload {
  const payload: ReceiverPayload = {
    name: form.name,
    powerConsumption: toFiniteNumber(form.powerConsumption),
    x: toFiniteNumber(form.x),
    y: toFiniteNumber(form.y),
  };

  if (receiverToEdit?.id != null) {
    return {
      ...payload,
      id: receiverToEdit.id,
    };
  }

  return payload;
}

export function hasReceiverCoordinates(receiver?: Partial<ReceiverModel> | null) {
  return Number.isFinite(receiver?.x) && Number.isFinite(receiver?.y);
}

export function resolveReceiverPower(receiver?: Partial<ReceiverModel> | null) {
  return toFiniteNumber(receiver?.powerConsumption);
}

export function hasReceiverPower(receiver?: Partial<ReceiverModel> | null) {
  return Number.isFinite(receiver?.powerConsumption);
}
