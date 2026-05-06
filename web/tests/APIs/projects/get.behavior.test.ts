import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { getAllProjects, getProjectById, getProjectsByUser } from "@api/projects";

vi.mock("@api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/projects/GET", () => {
  it("getAllProjects devuelve el arreglo recibido del backend", async () => {
    // Arrange
    const payload = [{ id: 1 }, { id: 2 }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: payload });

    // Act
    const result = await getAllProjects();

    // Assert
    expect(api.get).toHaveBeenCalledWith("/projects");
    expect(result).toEqual(payload);
  });

  it("getAllProjects devuelve [] cuando data no es arreglo", async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValueOnce({ data: { id: 1 } });

    // Act
    const result = await getAllProjects();

    // Assert
    expect(result).toEqual([]);
  });

  it("getAllProjects devuelve [] si falla la API", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(api.get).mockRejectedValueOnce(new Error("boom"));

    // Act
    const result = await getAllProjects();

    // Assert
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("getProjectsByUser usa su endpoint dedicado", async () => {
    // Arrange
    const payload = [{ id: 12, userId: 7 }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: payload });

    // Act
    const result = await getProjectsByUser(7);

    // Assert
    expect(api.get).toHaveBeenCalledWith("/projects/user/7");
    expect(result).toEqual(payload);
  });

  it("getProjectsByUser hace fallback a getAllProjects si falla la API", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fallbackProjects = [{ id: 1 }, { id: 2 }];
    vi.mocked(api.get)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({ data: fallbackProjects });

    // Act
    const result = await getProjectsByUser(5);

    // Assert
    expect(result).toEqual(fallbackProjects);
    expect(api.get).toHaveBeenNthCalledWith(1, "/projects/user/5");
    expect(api.get).toHaveBeenNthCalledWith(2, "/projects");
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("getProjectById devuelve el proyecto cuando la API responde ok", async () => {
    // Arrange
    const project = { id: 22, name: "Demo" };
    vi.mocked(api.get).mockResolvedValueOnce({ data: project });

    // Act
    const result = await getProjectById(22);

    // Assert
    expect(api.get).toHaveBeenCalledWith("/projects/22");
    expect(result).toEqual(project);
  });

  it("getProjectById lanza error si falta id", async () => {
    // Arrange
    const invalidId = undefined as never;

    // Act
    const result = getProjectById(invalidId);

    // Assert
    await expect(result).rejects.toThrow("getProjectById requiere un id");
    expect(api.get).not.toHaveBeenCalled();
  });
});
