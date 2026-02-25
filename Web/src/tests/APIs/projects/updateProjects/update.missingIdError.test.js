import { describe, it, expect, vi, afterEach } from 'vitest';
import { updateProject } from '@/api/projects'; // Asegúrate que updateProject esté exportado
import api from '@/api/api';

afterEach(() => {
  vi.restoreAllMocks(); // Limpia los mocks después de cada test
});

describe('updateProject - missing ID error handling', () => {

  it('should throw error when project ID is missing', async () => {
    // Llamamos updateProject con null para id
    await expect(updateProject(null, { name: 'Updated Project' }))
      .rejects
      .toThrow('updateProject requiere un id');
  });

  it('should successfully update when ID is provided', async () => {
    const id = 'p1';
    const payload = { name: 'Updated' };
    const mockResponse = { success: true };

    // Mockeamos api.put para no hacer request real
    vi.spyOn(api, 'put').mockResolvedValue({ data: mockResponse });

    const result = await updateProject(id, payload);

    expect(api.put).toHaveBeenCalledWith(`/projects/${id}`, payload);
    expect(result).toEqual(mockResponse);
  });
});