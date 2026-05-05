import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { deleteElement } from "@api/elements";

vi.mock("@api/api", () => ({
  default: {
    delete: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/elements/DELETE", () => {
  it("deleteElement usa consumer-element por defecto", async () => {
    // Arrange
    vi.mocked(api.delete).mockResolvedValueOnce({});

    // Act
    await deleteElement(3);

    // Assert
    expect(api.delete).toHaveBeenCalledWith("/consumer-element/3");
  });

  it("deleteElement acepta un elemento para resolver el endpoint correcto", async () => {
    // Arrange
    vi.mocked(api.delete).mockResolvedValueOnce({});

    // Act
    await deleteElement(9, { elementType: "generator" });

    // Assert
    expect(api.delete).toHaveBeenCalledWith("/generator-elements/9");
  });

  it("deleteElement lanza error si falta id", async () => {
    // Arrange
    const invalidId = undefined as never;

    // Act
    const result = deleteElement(invalidId);

    // Assert
    await expect(result).rejects.toThrow("deleteElement requiere un id");
    expect(api.delete).not.toHaveBeenCalled();
  });
});
