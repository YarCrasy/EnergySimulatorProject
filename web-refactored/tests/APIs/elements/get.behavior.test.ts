import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { getAllElements } from "@api/elements";

vi.mock("@api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/elements/GET", () => {
  it("getAllElements devuelve los elementos del backend cuando hay datos", async () => {
    // Arrange
    const payload = [{ id: 1, name: "Panel", elementType: "generator" }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: payload });

    // Act
    const result = await getAllElements();

    // Assert
    expect(api.get).toHaveBeenCalledWith("/elements");
    expect(result).toEqual(payload);
  });

  it("getAllElements usa fallback cuando el backend devuelve un arreglo vacio", async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    // Act
    const result = await getAllElements();

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]?.id).toBe("pv-default");
  });

  it("getAllElements usa fallback cuando falla la API", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(api.get).mockRejectedValueOnce(new Error("boom"));

    // Act
    const result = await getAllElements();

    // Assert
    expect(result).toHaveLength(3);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
