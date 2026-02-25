import { afterEach, describe, expect, it, vi } from 'vitest';

import api from '@api/api';
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} from '@api/projects';

vi.mock('@api/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('projects.js - CRUD behavior', () => {
  it('getAllProjects devuelve el arreglo recibido del backend', async () => {
    // Arrange
    const payload = [{ id: 1 }, { id: 2 }];
    api.get.mockResolvedValueOnce({ data: payload });

    // Act
    const result = await getAllProjects();

    // Assert
    expect(api.get).toHaveBeenCalledWith('/projects');
    expect(result).toEqual(payload);
  });

  it('getAllProjects devuelve [] cuando data no es arreglo', async () => {
    // Arrange
    api.get.mockResolvedValueOnce({ data: { id: 1 } });

    // Act
    const result = await getAllProjects();

    // Assert
    expect(result).toEqual([]);
  });

  it('getProjectById devuelve el proyecto cuando la API responde ok', async () => {
    // Arrange
    const project = { id: 22, name: 'Demo' };
    api.get.mockResolvedValueOnce({ data: project });

    // Act
    const result = await getProjectById(22);

    // Assert
    expect(api.get).toHaveBeenCalledWith('/projects/22');
    expect(result).toEqual(project);
  });

  it('getProjectById relanza el error y registra log', async () => {
    // Arrange
    const apiError = new Error('not found');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockRejectedValueOnce(apiError);

    // Act + Assert
    await expect(getProjectById(404)).rejects.toBe(apiError);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('createProject usa {} por defecto cuando no recibe payload', async () => {
    // Arrange
    const created = { id: 88, name: 'Nuevo Proyecto' };
    api.post.mockResolvedValueOnce({ data: created });

    // Act
    const result = await createProject();

    // Assert
    expect(api.post).toHaveBeenCalledWith('/projects', {});
    expect(result).toEqual(created);
  });

  it('createProject relanza el error y registra log', async () => {
    // Arrange
    const apiError = new Error('create failed');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.post.mockRejectedValueOnce(apiError);

    // Act + Assert
    await expect(createProject({ name: 'x' })).rejects.toBe(apiError);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('deleteProject devuelve true cuando elimina correctamente', async () => {
    // Arrange
    api.delete.mockResolvedValueOnce({});

    // Act
    const result = await deleteProject(15);

    // Assert
    expect(api.delete).toHaveBeenCalledWith('/projects/15');
    expect(result).toBe(true);
  });

  it('deleteProject relanza el error y registra log', async () => {
    // Arrange
    const apiError = new Error('delete failed');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    api.delete.mockRejectedValueOnce(apiError);

    // Act + Assert
    await expect(deleteProject(15)).rejects.toBe(apiError);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
