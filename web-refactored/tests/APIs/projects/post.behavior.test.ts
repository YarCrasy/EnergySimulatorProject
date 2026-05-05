import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { createProject, runProjectSimulation } from "@api/projects";

vi.mock("@api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/projects/POST", () => {
  it("createProject usa {} por defecto cuando no recibe payload", async () => {
    // Arrange
    const created = { id: 88, name: "Nuevo Proyecto" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: created });

    // Act
    const result = await createProject();

    // Assert
    expect(api.post).toHaveBeenCalledWith("/projects", {});
    expect(result).toEqual(created);
  });

  it("createProject relanza el error del API", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const apiError = new Error("create failed");
    vi.mocked(api.post).mockRejectedValueOnce(apiError);

    // Act
    const result = createProject({ name: "x" });

    // Assert
    await expect(result).rejects.toBe(apiError);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("runProjectSimulation usa la ruta del backend", async () => {
    // Arrange
    const payload = { durationDays: 3 };
    const simulation = { id: 99, status: "completed" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: simulation });

    // Act
    const result = await runProjectSimulation(22, payload);

    // Assert
    expect(api.post).toHaveBeenCalledWith("/projects/22/simulations", payload);
    expect(result).toEqual(simulation);
  });
});
