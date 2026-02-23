import { describe, expect, it } from 'vitest';

import { attachBackendIdentifiers } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js', () => {
  it('attachBackendIdentifiers asigna backendId cuando firma coincide', () => {
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
