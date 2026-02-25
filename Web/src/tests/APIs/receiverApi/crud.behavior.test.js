import { afterEach, describe, expect, it, vi } from 'vitest';

import api from '@api/api';
import { receiverApi } from '@api/receiverApi';

vi.mock('@api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('receiverApi.js - CRUD behavior', () => {
  it('getAll devuelve la lista de receivers', async () => {
    // Arrange
    const receivers = [{ id: 1 }, { id: 2 }];
    api.get.mockResolvedValueOnce({ data: receivers });

    // Act
    const result = await receiverApi.getAll();

    // Assert
    expect(api.get).toHaveBeenCalledWith('/consumer-element');
    expect(result).toEqual(receivers);
  });

  it('getAll usa fallback de mensaje cuando backend no provee detalle', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValueOnce(new Error('network'));

    // Act + Assert
    await expect(receiverApi.getAll()).rejects.toThrow('Error al cargar receivers');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('create devuelve response.data cuando crea correctamente', async () => {
    // Arrange
    const created = { id: 10, name: 'Receiver A' };
    api.post.mockResolvedValueOnce({ data: created });

    // Act
    const result = await receiverApi.create({ name: 'Receiver A' });

    // Assert
    expect(api.post).toHaveBeenCalledWith('/consumer-element', { name: 'Receiver A' });
    expect(result).toEqual(created);
  });

  it('create prioriza el mensaje del backend cuando existe', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Nombre duplicado' } },
    });

    // Act + Assert
    await expect(receiverApi.create({ name: 'x' })).rejects.toThrow('Nombre duplicado');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('update devuelve response.data cuando actualiza correctamente', async () => {
    // Arrange
    const updated = { id: 9, name: 'Receiver Updated' };
    api.put.mockResolvedValueOnce({ data: updated });

    // Act
    const result = await receiverApi.update(9, { name: 'Receiver Updated' });

    // Assert
    expect(api.put).toHaveBeenCalledWith('/consumer-element/9', { name: 'Receiver Updated' });
    expect(result).toEqual(updated);
  });

  it('update usa fallback cuando el backend no retorna message', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.put.mockRejectedValueOnce(new Error('timeout'));

    // Act + Assert
    await expect(receiverApi.update(9, { name: 'x' })).rejects.toThrow('Error al actualizar');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('delete resuelve sin error cuando elimina correctamente', async () => {
    // Arrange
    api.delete.mockResolvedValueOnce({});

    // Act
    const result = await receiverApi.delete(7);

    // Assert
    expect(api.delete).toHaveBeenCalledWith('/consumer-element/7');
    expect(result).toBeUndefined();
  });

  it('delete propaga mensaje del backend cuando falla', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.delete.mockRejectedValueOnce({
      response: { data: { message: 'Receiver no encontrado' } },
    });

    // Act + Assert
    await expect(receiverApi.delete(999)).rejects.toThrow('Receiver no encontrado');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
