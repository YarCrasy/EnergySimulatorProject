import { describe, it, expect, afterEach, vi } from 'vitest'
import { hydrateNodesFromCatalog } from '@/Logics/WorkspaceUtils'

afterEach(() => vi.restoreAllMocks())

describe('hydrateNodesFromCatalog - conditional update behavior', () => {
  it('should update node properties when catalog match exists (AAA)', () => {
    // Arrange
    const nodes = [{ id: 'n1', signature: 's1', label: 'Old', type: 'old' }]
    const catalog = [{ signature: 's1', label: 'New', type: 'panel' }]

    // Act
    const result = hydrateNodesFromCatalog(nodes, catalog)

    // Assert
    expect(result[0]).toMatchObject({ label: 'New', type: 'panel' })
  })

  it('should return unchanged nodes when catalog is null (AAA)', () => {
    // Arrange
    const nodes = [{ id: 'n1', signature: 's1', label: 'Label' }]

    // Act
    const result = hydrateNodesFromCatalog(nodes, null)

    // Assert
    expect(result).toEqual(nodes)
  })
})