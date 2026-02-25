import { describe, expect, it, vi } from 'vitest';

import {
  attachBackendIdentifiers,
  buildElementMetadataCache,
  buildProjectPayload,
  hydrateNodesFromCatalog,
  hydrateNodesWithMetadata,
  normalizeProject,
  serializeDiagram,
} from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js - serializeDiagram and attach branches', () => {
  it('serializeDiagram normaliza nodos y conexiones con fallbacks', () => {
    // Arrange
    const nodes = [
      {
        id: 'n1',
        backendId: undefined,
        meta: { id: 90 },
        position: { x: 1.236, y: '2.444' },
      },
    ];
    const connections = [
      {
        id: 'c1',
        backendId: undefined,
        source: 'n1',
        target: 'n2',
        connectionType: undefined,
      },
    ];

    // Act
    const serialized = serializeDiagram(nodes, connections);
    const result = JSON.parse(serialized);

    // Assert
    expect(result).toEqual({
      nodes: [
        {
          backendId: null,
          elementId: 90,
          positionX: 1.24,
          positionY: 2.44,
        },
      ],
      connections: [
        {
          backendId: null,
          source: 'n1',
          target: 'n2',
          connectionType: '',
        },
      ],
    });
  });

  it('attachBackendIdentifiers ignora apiNodes inválidos sin signature o sin id', () => {
    // Arrange
    const uiNodes = [
      {
        id: 'u1',
        backendId: null,
        elementId: 5,
        position: { x: 10, y: 20 },
      },
    ];
    const apiNodes = [
      {
        element: { id: null },
        positionX: 10,
        positionY: 20,
      },
      {
        id: null,
        element: { id: 5 },
        positionX: 10,
        positionY: 20,
      },
    ];

    // Act
    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    // Assert
    expect(result[0]).toBe(uiNodes[0]);
    expect(result[0].backendId).toBeNull();
  });

  it('attachBackendIdentifiers no reemplaza cuando el backendId coincide o es falsy', () => {
    // Arrange
    const uiNodes = [
      {
        id: 'u1',
        backendId: 44,
        elementId: 9,
        position: { x: 1, y: 2 },
      },
      {
        id: 'u2',
        backendId: null,
        elementId: 9,
        position: { x: 1, y: 2 },
      },
    ];

    const apiNodes = [
      {
        id: 44,
        element: { id: 9 },
        positionX: 1,
        positionY: 2,
      },
      {
        id: 0,
        element: { id: 9 },
        positionX: 1,
        positionY: 2,
      },
    ];

    // Act
    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    // Assert
    expect(result[0]).toBe(uiNodes[0]);
    expect(result[1]).toBe(uiNodes[1]);
  });

  it('attachBackendIdentifiers usa fallback 0 cuando posición API viene undefined', () => {
    // Arrange
    const uiNodes = [
      {
        id: 'u1',
        backendId: null,
        elementId: 3,
        position: { x: 0, y: 0 },
      },
    ];
    const apiNodes = [
      {
        id: 77,
        element: { id: 3 },
      },
    ];

    // Act
    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    // Assert
    expect(result[0]).toMatchObject({ backendId: 77 });
  });

  it('normalizeProject maneja project undefined con arrays vacíos', () => {
    // Act
    const result = normalizeProject(undefined);

    // Assert
    expect(result).toEqual({ nodes: [], connections: [] });
  });

  it('normalizeProject usa generateConnectionId y defaults en conexiones sin id/tipo', () => {
    // Arrange
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    const project = {
      projectNodes: [
        { id: 1, elementId: 11, positionX: 10, positionY: 20 },
        { id: 2, elementId: null, positionX: 30, positionY: 40 },
      ],
      nodeConnections: [
        {
          source: { id: 1 },
          target: { id: 2 },
        },
      ],
    };

    // Act
    const result = normalizeProject(project);

    // Assert
    expect(result.nodes[1].meta).toEqual({});
    expect(result.connections[0]).toMatchObject({
      id: 'conn-4fzzzxj',
      backendId: null,
      connectionType: '',
      label: '',
      source: 'node-1',
      target: 'node-2',
    });

    randomSpy.mockRestore();
  });

  it('buildProjectPayload aplica defaults de conexión para backendId y connectionType', () => {
    // Arrange
    const project = { id: 1, name: 'P', energyNeeded: 0, energyEnough: false, userId: 10 };
    const nodes = [
      { id: 'u1', backendId: 100, elementId: 1, position: { x: 1, y: 2 } },
      { id: 'u2', backendId: 200, elementId: 2, position: { x: 3, y: 4 } },
    ];
    const connections = [{ source: 'u1', target: 'u2' }];

    // Act
    const { payload } = buildProjectPayload(project, nodes, connections);

    // Assert
    expect(payload.nodeConnections).toEqual([
      {
        id: null,
        connectionType: '',
        source: { id: 100 },
        target: { id: 200 },
      },
    ]);
  });

  it('buildElementMetadataCache usa meta={} cuando el nodo no trae meta', () => {
    // Arrange
    const nodes = [
      {
        id: 'n1',
        elementId: 8,
        label: 'A',
        type: 'source',
        wattage: 120,
        notes: '',
        color: '#111',
      },
    ];

    // Act
    const cache = buildElementMetadataCache(nodes);

    // Assert
    expect(cache.get(8)).toMatchObject({
      meta: {},
    });
  });

  it('hydrateNodesWithMetadata mantiene valores del nodo cuando metadata trae undefined', () => {
    // Arrange
    const nodes = [
      {
        id: 'n1',
        elementId: 9,
        label: 'Keep label',
        type: 'Keep type',
        wattage: 555,
        notes: 'Keep notes',
        color: '#999',
      },
    ];
    const cache = new Map([[9, {}]]);

    // Act
    const result = hydrateNodesWithMetadata(nodes, cache);

    // Assert
    expect(result[0]).toMatchObject({
      label: 'Keep label',
      type: 'Keep type',
      wattage: 555,
      notes: 'Keep notes',
      color: '#999',
      meta: {},
    });
  });

  it('hydrateNodesFromCatalog usa fallbacks category/powerConsumption y fallback final al nodo', () => {
    // Arrange
    const nodes = [
      {
        id: 'n1',
        elementId: 1,
        label: 'Label node',
        type: 'Type node',
        wattage: 10,
        meta: {},
      },
      {
        id: 'n2',
        elementId: 2,
        label: 'Label node 2',
        type: 'Type node 2',
        wattage: 20,
        meta: {},
      },
    ];
    const catalog = new Map([
      [1, { id: 1, category: 'category-type', powerConsumption: 77 }],
      [2, { id: 2 }],
    ]);

    // Act
    const result = hydrateNodesFromCatalog(nodes, catalog);

    // Assert
    expect(result[0]).toMatchObject({
      label: 'Label node',
      type: 'category-type',
      wattage: 77,
    });
    expect(result[1]).toMatchObject({
      label: 'Label node 2',
      type: 'Type node 2',
      wattage: 20,
    });
  });
});
