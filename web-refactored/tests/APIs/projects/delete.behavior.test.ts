import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { deleteProject } from "@api/projects";

vi.mock("@api/api", () => ({
  default: {
    delete: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/projects/DELETE", () => {
  it("deleteProject devuelve true cuando elimina correctamente", async () => {
    // Arrange
    vi.mocked(api.delete).mockResolvedValueOnce({});

    // Act
    const result = await deleteProject(15);

    // Assert
    expect(result).toBe(true);
    expect(api.delete).toHaveBeenCalledWith("/projects/15");
  });

  it("deleteProject lanza error si falta id", async () => {
    // Arrange
    const invalidId = undefined as never;

    // Act
    const result = deleteProject(invalidId);

    // Assert
    await expect(result).rejects.toThrow("deleteProject requiere un id");
    expect(api.delete).not.toHaveBeenCalled();
  });
});
