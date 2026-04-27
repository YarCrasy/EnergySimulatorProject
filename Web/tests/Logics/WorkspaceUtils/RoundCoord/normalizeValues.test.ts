import { describe, expect, it } from 'vitest';
import { roundCoord } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js - roundCoord', () => {
  it('rounds numbers to 2 decimals', () => {
    expect(roundCoord(1.234)).toBe(1.23);
    expect(roundCoord(1.2356)).toBe(1.24);
    expect(roundCoord(-3.456)).toBe(-3.46);
  });

  it('converts and rounds numeric strings', () => {
    expect(roundCoord('2.345')).toBe(2.35);
    expect(roundCoord('2.3456')).toBe(2.35);
  });

  it('falls back to 0 for invalid values', () => {
    expect(roundCoord(undefined)).toBe(0);
    expect(roundCoord(null)).toBe(0);
    expect(roundCoord('no-number')).toBe(0);
  });
});
