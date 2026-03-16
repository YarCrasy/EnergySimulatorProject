import { describe, expect, it } from 'vitest';

import { buildNodeSignature } from '@/pages/simulator/workspace/WorkspaceUtils';

describe('WorkspaceUtils.js', () => {
  it('buildNodeSignature devuelve null sin elementId', () => {
    expect(buildNodeSignature(undefined, 10, 20)).toBeNull();
  });
});
