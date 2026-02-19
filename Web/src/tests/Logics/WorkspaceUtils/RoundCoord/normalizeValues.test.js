import { describe, it, expect, afterEach, vi } from 'vitest'
import { roundCoord } from '@/Logics/WorkspaceUtils'

afterEach(() => vi.restoreAllMocks())

describe('roundCoord - normalize coordinate values', () => {
  it('should round numbers to 2 decimals (AAA)', () => {
    // Arrange
    const num = 1.2356

    // Act
    const result = roundCoord(num)

    // Assert
    expect(result).toBeCloseTo(1.24, 2)
  })

  it('should handle null values gracefully (AAA)', () => {
    // Arrange
    const nil = null

    // Act
    const result = roundCoord(nil)

    // Assert
    expect(result).toBeNull()
  })

  it('should convert and round numeric strings (AAA)', () => {
    // Arrange
    const str = '2.3456'

    // Act
    const result = roundCoord(str)

    // Assert
    expect(result).toBeCloseTo(2.35, 2)
  })
})