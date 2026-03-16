import { describe, expect, it } from 'vitest';

import { buildProjectPayload } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js', () => {
  it('buildProjectPayload cuenta skippedNodes/skippedConnections', () => {
    const project = {
      id: 1,
      name: 'P',
      energyNeeded: 0,
      energyEnough: false,
      userId: 99,
    };

    const nodes = [
      {
        id: 'n1',
        backendId: 11,
        elementId: 1,
        position: { x: 1.111, y: 2.222 },
      },
      {
        id: 'n2',
        backendId: 22,
        position: { x: 3, y: 4 },
      },
      {
        id: 'n3',
        backendId: null,
        elementId: 3,
        position: { x: 0, y: 0 },
      },
    ];

    const connections = [
      { id: 'c1', backendId: 91, source: 'n1', target: 'n2', connectionType: 'a' },
      { id: 'c2', backendId: 92, source: 'n1', target: 'n3', connectionType: 'b' },
      { id: 'c3', backendId: 93, source: 'n1', target: 'n1', connectionType: 'c' },
    ];

    const { payload, skippedNodes, skippedConnections } = buildProjectPayload(
      project,
      nodes,
      connections,
    );

    expect(skippedNodes).toBe(1);
    expect(skippedConnections).toBe(2);

    expect(payload.projectNodes).toHaveLength(2);
    expect(payload.projectNodes[0]).toMatchObject({
      id: 11,
      element: { id: 1 },
      positionX: 1.11,
      positionY: 2.22,
    });

    expect(payload.nodeConnections).toHaveLength(1);
    expect(payload.nodeConnections[0]).toEqual({
      id: 93,
      connectionType: 'c',
      source: { id: 11 },
      target: { id: 11 },
    });
  });
});
