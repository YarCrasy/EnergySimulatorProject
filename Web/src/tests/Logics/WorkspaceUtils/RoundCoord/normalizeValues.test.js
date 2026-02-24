import { describe, it, expect, afterEach, vi } from 'vitest';
import { roundCoord } from '@/pages/simulator/workspace/WorkspaceUtils';

afterEach(() => vi.restoreAllMocks());

describe('WorkspaceUtils.js - roundCoord', () => {
  it('should round numbers to 2 decimals', () => {
    expect(roundCoord(1.2356)).toBeCloseTo(1.24, 2);
  });

 it('should handle null values gracefully', () => {
  expect(roundCoord(null)).toBe(0);
});

  it('should convert and round numeric strings', () => {
    expect(roundCoord('2.3456')).toBeCloseTo(2.35, 2);
  });
});