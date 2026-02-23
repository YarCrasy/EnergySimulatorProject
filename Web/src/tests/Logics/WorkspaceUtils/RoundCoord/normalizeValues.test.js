import { describe, expect, it } from 'vitest';

import { roundCoord } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js', () => {
  it('roundCoord normaliza a 2 decimales y hace fallback a 0', () => {
    expect(roundCoord(1.234)).toBe(1.23);
    expect(roundCoord('2.345')).toBe(2.35);
    expect(roundCoord(undefined)).toBe(0);
    expect(roundCoord('no-number')).toBe(0);
    expect(roundCoord(null)).toBe(0);
    expect(roundCoord(-3.456)).toBe(-3.46);
  });
});
