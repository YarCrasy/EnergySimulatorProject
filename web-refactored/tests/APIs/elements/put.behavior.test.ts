import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { updateElement } from "@api/elements";

vi.mock("@api/api", () => ({
  default: {
    put: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/elements/PUT", () => {
  it("updateElement enruta generators a su controlador especifico", async () => {
    // Arrange
    const payload = { name: "Panel Pro", elementType: "generator", powerWatt: 700 };
    const updated = { id: 7, ...payload };
    vi.mocked(api.put).mockResolvedValueOnce({ data: updated });

    // Act
    const result = await updateElement(7, payload);

    // Assert
    expect(api.put).toHaveBeenCalledWith("/generator-elements/7", {
      ...payload,
      elementType: "generator",
    });
    expect(result).toEqual(updated);
  });

  it("updateElement enruta storage a battery-elements", async () => {
    // Arrange
    const payload = { name: "Reserva", elementType: "storage", capacity: 8 };
    vi.mocked(api.put).mockResolvedValueOnce({ data: { id: 4, ...payload, elementType: "battery" } });

    // Act
    const result = await updateElement(4, payload);

    // Assert
    expect(result).toEqual({ id: 4, ...payload, elementType: "battery" });
    expect(api.put).toHaveBeenCalledWith("/battery-elements/4", {
      ...payload,
      elementType: "battery",
    });
  });
});
