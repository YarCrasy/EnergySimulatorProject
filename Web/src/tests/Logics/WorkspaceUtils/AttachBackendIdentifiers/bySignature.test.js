import { describe, it, expect } from 'vitest';
import { attachBackendIdentifiers } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js - attachBackendIdentifiers', () => {
  it('should assign backendId to nodes matching catalog by signature', () => {

    const uiNodes = [
      {
        id: 'node_1',
        elementId: 1,
        position: { x: 0, y: 0 }
      },
      {
        id: 'node_2',
        elementId: 2,
        position: { x: 10, y: 10 }
      },
      {
        id: 'node_3',
        elementId: 3,
        position: { x: 20, y: 20 }
      }
    ];

    const apiNodes = [
      {
        id: 'backend_001',
        element: { id: 1 },
        positionX: 0,
        positionY: 0
      },
      {
        id: 'backend_002',
        element: { id: 2 },
        positionX: 10,
        positionY: 10
      }
    ];

    const result = attachBackendIdentifiers(uiNodes, apiNodes);

    expect(result[0].backendId).toBe('backend_001');
    expect(result[1].backendId).toBe('backend_002');
    expect(result[2].backendId).toBeUndefined();
  });
});