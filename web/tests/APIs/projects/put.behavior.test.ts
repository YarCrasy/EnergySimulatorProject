import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { updateProject } from "@api/projects";

vi.mock("@api/api", () => ({
  default: {
    put: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/projects/PUT", () => {
  it("updateProject lanza error si falta id", async () => {
    // Arrange
    const invalidId = undefined as never;

    // Act
    const result = updateProject(invalidId);

    // Assert
    await expect(result).rejects.toThrow("updateProject requiere un id");
    expect(api.put).not.toHaveBeenCalled();
  });

  it("updateProject hace PUT y devuelve data cuando recibe id", async () => {
    // Arrange
    const payload = { name: "Updated" };
    const response = { id: 3, ...payload };
    vi.mocked(api.put).mockResolvedValueOnce({ data: response });

    // Act
    const result = await updateProject(3, payload);

    // Assert
    expect(result).toEqual(response);
    expect(api.put).toHaveBeenCalledWith("/projects/3", payload);
  });
});
