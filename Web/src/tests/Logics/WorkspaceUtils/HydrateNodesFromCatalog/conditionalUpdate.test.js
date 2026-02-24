import { describe, it, expect } from 'vitest'
import { hydrateNodesFromCatalog } from '@/pages/simulator/workspace/WorkspaceUtils'

describe('hydrateNodesFromCatalog - conditional update behavior', () => {

  it('should update node properties when catalog match exists', () => {

    const nodes = [
      {
        id: 'n1',
        elementId: 1,
        label: 'Old',
        type: 'old',
        wattage: 100,
        meta: {},
      }
    ]

    const catalog = new Map()
    catalog.set(1, {
      id: 1,
      name: 'New',
      elementType: 'panel',
      powerWatt: 300
    })

    const result = hydrateNodesFromCatalog(nodes, catalog)

    expect(result[0]).toMatchObject({
      label: 'New',
      type: 'panel',
      wattage: 300
    })
  })

  it('should return unchanged nodes when catalog is null', () => {

    const nodes = [
      { id: 'n1', elementId: 1, label: 'Label' }
    ]

    const result = hydrateNodesFromCatalog(nodes, null)

    expect(result).toEqual(nodes)
  })

})