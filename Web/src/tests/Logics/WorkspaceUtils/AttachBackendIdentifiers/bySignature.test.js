import { describe, expect, it } from 'vitest';

import { attachBackendIdentifiers } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js - attachBackendIdentifiers', () => {
  it('assigns backendId to nodes matching catalog by signature', () => {
    const uiNodes = [
      {
        id: 'node_1',
        elementId: 1,
        position: { x: 0, y: 0 },
      },
      {
        id: 'node_2',
        elementId: 2,
        position: { x: 10, y: 10 },
      },
      {
        id: 'node_3',
        elementId: 3,
        position: { x: 20, y: 20 },
      },
    ];

    const apiNodes = [
      {
        id: 'backend_001',
        element: { id: 1 },
        positionX: 0,
        positionY: 0,
      },
      {
        id: 'backend_002',
        element: { id: 2 },
        positionX: 10,
        positionY: 10,
      },
    ];

    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    expect(result[0].backendId).toBe('backend_001');
    expect(result[1].backendId).toBe('backend_002');
    expect(result[2].backendId).toBeUndefined();
  });

  it('assigns backendId when signature matches with rounded coordinates', () => {
    const uiNodes = [
      {
        id: 'u1',
        backendId: null,
        elementId: 5,
        position: { x: 1.234, y: 5.678 },
      },
    ];

    const apiNodes = [
      {
        id: 99,
        element: { id: 5 },
        positionX: 1.23,
        positionY: 5.68,
      },
    ];

    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: 'u1', elementId: 5, backendId: 99 });
  });

  it('attachBackendIdentifiers mantiene la referencia original si apiNodes está vacío', () => {
    const uiNodes = [
      {
        id: 'u1',
        backendId: null,
        elementId: 5,
        position: { x: 1.234, y: 5.678 },
      },
    ];

    const result = attachBackendIdentifiers(uiNodes, []);

    expect(result).toBe(uiNodes);
  });

  it('attachBackendIdentifiers no altera nodos sin firma válida o sin match', () => {
    const uiNodes = [
      {
        id: 'u1',
        backendId: null,
        elementId: null,
        position: { x: 1.234, y: 5.678 },
      },
      {
        id: 'u2',
        backendId: null,
        elementId: 20,
        position: { x: 1, y: 1 },
      },
    ];

    const apiNodes = [
      {
        id: 100,
        element: { id: 5 },
        positionX: 1.23,
        positionY: 5.68,
      },
    ];

    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    expect(result[0].backendId).toBeNull();
    expect(result[1].backendId).toBeNull();
  });
});
