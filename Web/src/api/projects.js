import { describe, it, expect, vi, afterEach } from 'vitest'
import { updateProject, getAllProjects } from '@/api/projects'
import api from '@/api/api'

afterEach(() => vi.restoreAllMocks())

describe('updateProject - missing ID error handling', () => {

  it('should throw error when project ID is missing', async () => {
    await expect(updateProject(null, { name: 'Updated' }))
      .rejects
      .toThrow('updateProject requiere un id')
  })

  it('should successfully update when ID is provided', async () => {
    const mockResponse = { success: true }

    vi.spyOn(api, 'put').mockResolvedValue({ data: mockResponse })

    const result = await updateProject('p1', { name: 'Updated' })

    expect(api.put).toHaveBeenCalledWith('/projects/p1', { name: 'Updated' })
    expect(result).toEqual(mockResponse)
  })
})

describe('getAllProjects', () => {
  it('devuelve [] si falla la API', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(api, 'get').mockRejectedValueOnce(new Error('boom'))

    await expect(getAllProjects()).resolves.toEqual([])

    consoleError.mockRestore()
  })
})
