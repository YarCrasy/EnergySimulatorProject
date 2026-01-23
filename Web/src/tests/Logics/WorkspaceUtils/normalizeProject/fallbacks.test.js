import { describe, expect, it, vi } from 'vitest';

import { normalizeProject, palette } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js', () => {
  it('normalizeProject crea nodos con palette y posiciones fallback', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.123456789);

    const project = {
      projectNodes: [
        {
          id: 10,
          element: { id: 5, name: 'Solar', elementType: 'source', powerWatt: 123 },
          positionX: 50,
          positionY: 70,
        },
        {
          elementId: 8,
        },
      ],
      nodeConnections: [],
    };

    const normalized = normalizeProject(project);

    expect(normalized.nodes).toHaveLength(2);
    expect(normalized.nodes[0].color).toBe(palette[0]);
    expect(normalized.nodes[1].color).toBe(palette[1]);

    expect(normalized.nodes[1].position).toEqual({ x: 230, y: 184 });
    expect(normalized.nodes[1].id.startsWith('node-')).toBe(true);

    randomSpy.mockRestore();
  });
});
