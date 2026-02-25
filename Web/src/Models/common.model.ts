export type EntityId = number | string;

export type TimestampValue = string | Date;

export function toFiniteNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}
