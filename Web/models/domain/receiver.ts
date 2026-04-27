import type { Identifier } from "../common";

export interface Receiver {
  id?: Identifier | null;
  name?: string;
  powerConsumption?: number | string | null;
  x?: number | string | null;
  y?: number | string | null;
}

export interface ReceiverPayload {
  id?: Identifier;
  name: string;
  powerConsumption: number;
  x: number;
  y: number;
}

export type ReceiverEditState = Receiver;
