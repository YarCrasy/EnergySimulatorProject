import { describe, expect, it } from 'vitest';

import { buildElementDictionary, hydrateNodesFromCatalog } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('hydrateNodesFromCatalog - conditional update behavior', () => {
  it('does not mutate when node already matches catalog', () => {
    const catalogEntry = { id: 1, name: 'Solar', elementType: 'source', powerWatt: 100 };
    const catalog = buildElementDictionary([catalogEntry]);
    const nodes = [
      {
        id: 'n1',
        elementId: 1,
        label: 'Solar',
        type: 'source',
        wattage: 100,
        meta: catalogEntry,
      },
    ];

    const result = hydrateNodesFromCatalog(nodes, catalog);

    expect(result).toBe(nodes);
    expect(result[0]).toBe(nodes[0]);
  });

  it('updates label/type/wattage/meta when catalog match exists', () => {
    const catalogEntry = { id: 3, name: 'Battery', elementType: 'storage', powerWatt: 450 };
    const catalog = buildElementDictionary([catalogEntry]);

    const nodes = [
      {
        id: 'n1',
        elementId: 3,
        label: 'Old',
        type: 'old-type',
        wattage: 0,
        meta: {},
      },
    ];

    const result = hydrateNodesFromCatalog(nodes, catalog);

    expect(result).not.toBe(nodes);
    expect(result[0]).toMatchObject({
      label: 'Battery',
      type: 'storage',
      wattage: 450,
      meta: catalogEntry,
    });
  });

  it('supports plain Map catalogs', () => {
    const nodes = [{ id: 'n1', elementId: 1, label: 'Old', type: 'old', wattage: 10, meta: {} }];
    const catalog = new Map([
      [1, { id: 1, name: 'New', elementType: 'panel', powerWatt: 300 }],
    ]);

    const result = hydrateNodesFromCatalog(nodes, catalog);

    expect(result[0]).toMatchObject({
      label: 'New',
      type: 'panel',
      wattage: 300,
    });
  });

  it('returns same array when catalog is invalid', () => {
    const nodes = [{ id: 'n1', elementId: 3, label: 'X' }];

    expect(hydrateNodesFromCatalog(nodes, null)).toBe(nodes);
    expect(hydrateNodesFromCatalog(nodes, new Map())).toBe(nodes);
  });
});
