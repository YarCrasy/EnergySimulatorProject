import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { createElement } from "@api/elements";

vi.mock("@api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("tests/APIs/elements/POST", () => {
  it("createElement normaliza storage a battery y usa el endpoint generico", async () => {
    // Arrange
    const payload = { name: "Bateria 5kWh", elementType: "storage", capacity: 5 };
    const created = { id: 10, name: "Bateria 5kWh", elementType: "battery" };
    vi.mocked(api.post).mockResolvedValueOnce({ data: created });

    // Act
    const result = await createElement(payload);

    // Assert
    expect(api.post).toHaveBeenCalledWith("/elements", {
      ...payload,
      elementType: "battery",
    });
    expect(result).toEqual(created);
  });
});
