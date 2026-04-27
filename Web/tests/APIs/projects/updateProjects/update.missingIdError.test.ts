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

describe("projects.js", () => {
  it("updateProject lanza error si falta id (undefined)", async () => {
    await expect(updateProject()).rejects.toThrow("updateProject requiere un id");
    expect(api.put).not.toHaveBeenCalled();
  });

  it("updateProject lanza error si falta id (null)", async () => {
    await expect(updateProject(null, { name: "Updated Project" })).rejects.toThrow(
      "updateProject requiere un id",
    );
    expect(api.put).not.toHaveBeenCalled();
  });

  it("updateProject hace PUT y devuelve data cuando recibe id", async () => {
    const id = "p1";
    const payload = { name: "Updated" };
    const mockResponse = { success: true };
    api.put.mockResolvedValueOnce({ data: mockResponse });

    await expect(updateProject(id, payload)).resolves.toEqual(mockResponse);
    expect(api.put).toHaveBeenCalledWith(`/projects/${id}`, payload);
  });

  it("updateProject relanza el error del API", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const apiError = new Error("boom");
    api.put.mockRejectedValueOnce(apiError);

    await expect(updateProject(1, { name: "P" })).rejects.toBe(apiError);

    consoleError.mockRestore();
  });
});
