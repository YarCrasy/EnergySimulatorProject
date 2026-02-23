import { afterEach, describe, expect, it, vi } from 'vitest';

import api from '@api/api';
import { updateProject } from '@api/projects';

vi.mock('@api/api', () => ({
  default: {
    put: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('projects.js', () => {
  it('updateProject lanza error si falta id', async () => {
    await expect(updateProject()).rejects.toThrow('updateProject requiere un id');
    expect(api.put).not.toHaveBeenCalled();
  });

  it('updateProject hace PUT y devuelve data cuando recibe id', async () => {
    const payload = { name: 'Updated Project' };
    api.put.mockResolvedValueOnce({ data: { id: 1, ...payload } });

    await expect(updateProject(1, payload)).resolves.toEqual({
      id: 1,
      ...payload,
    });
    expect(api.put).toHaveBeenCalledWith('/projects/1', payload);
  });

  it('updateProject relanza el error del API', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const apiError = new Error('boom');
    api.put.mockRejectedValueOnce(apiError);

    await expect(updateProject(1, { name: 'P' })).rejects.toBe(apiError);

    consoleError.mockRestore();
  });
});
