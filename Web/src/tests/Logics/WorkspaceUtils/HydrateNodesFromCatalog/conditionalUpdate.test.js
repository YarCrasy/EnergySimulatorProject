import { describe, expect, it } from 'vitest';

import { buildElementDictionary, hydrateNodesFromCatalog } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js', () => {
  it('hydrateNodesFromCatalog no muta si el nodo ya coincide con el catálogo', () => {
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

  it('hydrateNodesFromCatalog actualiza label/type/wattage cuando encuentra catálogo', () => {
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

  it('hydrateNodesFromCatalog devuelve el mismo array cuando no hay catálogo válido', () => {
    const nodes = [{ id: 'n1', elementId: 3, label: 'X' }];

    expect(hydrateNodesFromCatalog(nodes, null)).toBe(nodes);
    expect(hydrateNodesFromCatalog(nodes, new Map())).toBe(nodes);
  });
});
