export type Identifier = string | number;

export type LooseRecord = Record<string, unknown>;

export function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
