import { describe, expect, it } from 'vitest';

import {
  buildElementMetadataCache,
  buildElementDictionary,
  hydrateNodesFromCatalog,
  hydrateNodesWithMetadata,
  normalizeProject,
} from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js - metadata hydration', () => {
  it('buildElementMetadataCache omite nodos sin elementId', () => {
    // Arrange
    const nodes = [
      {
        id: 'n1',
        elementId: 10,
        label: 'Label A',
        type: 'source',
        wattage: 100,
        notes: 'ok',
        color: '#fff',
        meta: { id: 10 },
      },
      {
        id: 'n2',
        label: 'Sin elemento',
      },
    ];

    // Act
    const cache = buildElementMetadataCache(nodes);

    // Assert
    expect(cache.size).toBe(1);
    expect(cache.get(10)).toMatchObject({
      label: 'Label A',
      type: 'source',
      wattage: 100,
      notes: 'ok',
      color: '#fff',
      meta: { id: 10 },
    });
  });

  it('hydrateNodesWithMetadata retorna el arreglo original si cache es inválido', () => {
    // Arrange
    const nodes = [{ id: 'n1', elementId: 1, label: 'Old' }];

    // Act
    const result = hydrateNodesWithMetadata(nodes, null);

    // Assert
    expect(result).toBe(nodes);
  });

  it('hydrateNodesWithMetadata aplica metadata y conserva meta existente si ya hay datos', () => {
    // Arrange
    const nodes = [
      {
        id: 'n1',
        elementId: 5,
        label: 'Old',
        type: 'old',
        wattage: 1,
        notes: '',
        color: '#111',
        meta: {},
      },
      {
        id: 'n2',
        elementId: 6,
        label: 'Keep',
        type: 'type',
        wattage: 2,
        notes: 'note',
        color: '#222',
        meta: { keep: true },
      },
      {
        id: 'n3',
        label: 'Sin elementId',
      },
    ];

    const cache = new Map([
      [5, { label: 'From cache', type: 'new', wattage: 300, notes: 'meta', color: '#abc', meta: { id: 5 } }],
      [6, { label: 'Should update', type: 'x', wattage: 400, notes: 'y', color: '#def', meta: { id: 6 } }],
    ]);

    // Act
    const result = hydrateNodesWithMetadata(nodes, cache);

    // Assert
    expect(result[0]).toMatchObject({
      label: 'From cache',
      type: 'new',
      wattage: 300,
      notes: 'meta',
      color: '#abc',
      meta: { id: 5 },
    });
    expect(result[1].meta).toEqual({ keep: true });
    expect(result[2]).toBe(nodes[2]);
  });

  it('hydrateNodesWithMetadata deja el nodo igual cuando no hay metadata para su elementId', () => {
    // Arrange
    const node = {
      id: 'n1',
      elementId: 12,
      label: 'Same',
      type: 'same',
      wattage: 10,
      notes: 'ok',
      color: '#000',
      meta: {},
    };
    const cache = new Map([[99, { label: 'Other' }]]);

    // Act
    const result = hydrateNodesWithMetadata([node], cache);

    // Assert
    expect(result[0]).toBe(node);
  });

  it('buildElementDictionary ignora elementos nulos o sin id', () => {
    // Arrange
    const elements = [null, { id: null, name: 'x' }, { id: 3, name: 'Receiver' }];

    // Act
    const dictionary = buildElementDictionary(elements);

    // Assert
    expect(dictionary.size).toBe(1);
    expect(dictionary.get(3)).toEqual({ id: 3, name: 'Receiver' });
  });

  it('normalizeProject filtra conexiones sin nodos mapeados y conserva las válidas', () => {
    // Arrange
    const project = {
      projectNodes: [
        { id: 1, element: { id: 11, name: 'A' }, positionX: 10, positionY: 20 },
        { id: 2, element: { id: 22, name: 'B' }, positionX: 30, positionY: 40 },
      ],
      nodeConnections: [
        { id: 100, connectionType: 'ok', source: { id: 1 }, target: { id: 2 } },
        { id: 101, connectionType: 'skip-source', source: { id: 999 }, target: { id: 2 } },
        { id: 102, connectionType: 'skip-target', source: { id: 1 }, target: { id: 888 } },
      ],
    };

    // Act
    const normalized = normalizeProject(project);

    // Assert
    expect(normalized.nodes).toHaveLength(2);
    expect(normalized.connections).toHaveLength(1);
    expect(normalized.connections[0]).toMatchObject({
      id: 'conn-100',
      backendId: 100,
      connectionType: 'ok',
      label: 'ok',
      source: 'node-1',
      target: 'node-2',
    });
  });

  it('hydrateNodesFromCatalog no muta nodos sin elementId', () => {
    // Arrange
    const nodes = [{ id: 'n1', label: 'Sin elementId' }];
    const catalog = new Map([[1, { id: 1, name: 'Node', elementType: 'source', powerWatt: 50 }]]);

    // Act
    const result = hydrateNodesFromCatalog(nodes, catalog);

    // Assert
    expect(result).toEqual(nodes);
    expect(result[0]).toBe(nodes[0]);
  });
});
