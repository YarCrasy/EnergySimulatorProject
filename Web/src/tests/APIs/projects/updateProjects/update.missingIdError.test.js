
import { describe, expect, it, vi } from 'vitest';
import { updateProject } from '@/apis/projects/updateProject'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('updateProject - missing ID error handling', () => {
  it('should throw error when project ID is missing', async () => {
    // Arrange
    const invalidPayload = { name: 'Updated Project' }

    // Act & Assert
    await expect(updateProject(invalidPayload)).rejects.toThrow()
  })

  it('should successfully update when ID is provided', async () => {
    // Arrange
    const validPayload = { id: 'p1', name: 'Updated' }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, ...validPayload })
    }))

    // Act
    const result = await updateProject(validPayload)

    // Assert
    expect(result.success).toBe(true)
  })
})