import { describe, expect, it, vi } from 'vitest';

vi.mock('@/api/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import api from '@/api/api';
import { getAllProjects } from '@/api/projects';

describe('projects.js', () => {
  it('getAllProjects devuelve [] si falla la API', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValueOnce(new Error('boom'));

    await expect(getAllProjects()).resolves.toEqual([]);

    consoleError.mockRestore();
  });
});
