import { describe, expect, it, vi } from 'vitest';

vi.mock('@api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '@api/api';
import { receiverApi } from '@api/receiverApi';

describe('receiverApi.js', () => {
  it('receiverApi.create lanza error con mensaje del backend', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Backend error' } },
    });

    await expect(receiverApi.create({ name: 'x' })).rejects.toThrow('Backend error');

    consoleError.mockRestore();
  });
});
