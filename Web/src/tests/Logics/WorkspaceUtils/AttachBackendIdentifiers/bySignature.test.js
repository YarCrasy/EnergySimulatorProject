import { describe, it, expect } from 'vitest';
import { attachBackendIdentifiers } from '@/Logics/WorkspaceUtils/AttachBackendIdentifiers';

describe('attachBackendIdentifiers - bySignature', () => {
  it('should assign backendId to nodes matching catalog by signature', () => {
    // Arrange
    const catalog = [
      { signature: 'sig_001', backendId: 'backend_001' },
      { signature: 'sig_002', backendId: 'backend_002' }
    ];
    const nodes = [
      { id: 'node_1', signature: 'sig_001' },
      { id: 'node_2', signature: 'sig_002' },
      { id: 'node_3', signature: 'sig_unknown' }
    ];

    // Act
    const result = attachBackendIdentifiers(nodes, catalog);

    // Assert
    expect(result[0]).toEqual({ id: 'node_1', signature: 'sig_001', backendId: 'backend_001' });
    expect(result[1]).toEqual({ id: 'node_2', signature: 'sig_002', backendId: 'backend_002' });
    expect(result[2].backendId).toBeUndefined();
  });
});