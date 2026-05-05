import { act, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import api from "@api/api";
import { useAuth } from "@/auth/auth";
import { AuthProvider } from "@/auth/AuthProvider";

vi.mock("@api/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

function AuthSnapshot({ onChange }: { onChange: (auth: ReturnType<typeof useAuth>) => void }) {
  const auth = useAuth();
  onChange(auth);
  return null;
}

describe("tests/Logics/Security/AuthProvider", () => {
  let auth: ReturnType<typeof useAuth> | null = null;

  function mountProvider() {
    render(
      <AuthProvider>
        <AuthSnapshot onChange={(snapshot) => { auth = snapshot; }} />
      </AuthProvider>,
    );
  }

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    localStorage.clear();
    auth = null;
  });

  it("sanitiza payload con script al hidratar sesion desde localStorage", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      id: 9,
      name: "Ana<script>alert(\"x\")</script>",
      email: "ana@corp.com<script>alert(\"x\")</script>",
      role: "admin",
    }));
    localStorage.setItem("auth:token", "token-9");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toEqual({
        id: 9,
        name: "Ana",
        email: "ana@corp.com",
        role: "admin",
      });
    });
  });

  it("login exitoso sanitiza campos para evitar inyeccion de scripts", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        token: "token-33",
        user: {
          id: 33,
          fullName: "Eva<script>alert(\"hack\")</script>",
          email: "eva@energy.com<script>alert(\"hack\")</script>",
          admin: false,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    let result: Awaited<ReturnType<NonNullable<typeof auth>["login"]>> | undefined;
    await act(async () => {
      result = await auth!.login("eva@energy.com", "123456");
    });

    // Assert
    expect(result).toEqual({ id: 33, name: "Eva", role: "user" });
    await waitFor(() => {
      expect(auth?.user).toEqual({
        id: 33,
        name: "Eva",
        email: "eva@energy.com",
        role: "user",
      });
    });
    expect(localStorage.getItem("auth:user")).not.toContain("<script");
  });

  it("normaliza rol manipulado en localStorage para evitar escalacion por role tampering", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      id: 77,
      name: "Tampered User",
      email: "tampered@corp.com",
      role: "super-admin",
    }));
    localStorage.setItem("auth:token", "token-77");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toMatchObject({
        id: 77,
        role: "user",
      });
    });
  });

  it("elimina prefijos javascript y tags HTML al hidratar sesion", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      id: 88,
      name: "<b>Ana</b> javascript:alert(1)",
      email: "javascript:ana@corp.com",
      role: "user",
    }));
    localStorage.setItem("auth:token", "token-88");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user?.name).not.toContain("<");
      expect(auth?.user?.name).not.toContain("javascript:");
      expect(auth?.user?.email).toBe("ana@corp.com");
    });
  });

  it("descarta sesion manipulada sin id y limpia persistencia", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      name: "Missing Id",
      email: "missing@corp.com",
      role: "admin",
    }));
    localStorage.setItem("auth:token", "token-missing");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toBeNull();
    });
    expect(localStorage.getItem("auth:user")).toBeNull();
    expect(localStorage.getItem("auth:token")).toBeNull();
  });

  it("descarta sesion cuando localStorage contiene un valor no objeto", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify("texto-plano"));
    localStorage.setItem("auth:token", "token-plain");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toBeNull();
    });
    expect(localStorage.getItem("auth:user")).toBeNull();
    expect(localStorage.getItem("auth:token")).toBeNull();
  });

  it("normaliza campos no string a string vacio durante hidratacion", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      id: 44,
      name: 1234,
      email: null,
      role: "admin",
    }));
    localStorage.setItem("auth:token", "token-44");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toEqual({
        id: 44,
        name: "",
        email: "",
        role: "admin",
      });
    });
  });

  it("si backend responde login sin token o sin usuario no persiste sesion y falla de forma controlada", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        user: {
          id: 45,
          fullName: "No Token",
          email: "notoken@corp.com",
          admin: false,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    const result = act(async () => {
      await expect(auth!.login("notoken@corp.com", "secret")).rejects.toThrow(
        "Usuario o contrasena incorrectos",
      );
    });

    // Assert
    await result;
    expect(auth?.user).toBeNull();
    expect(localStorage.getItem("auth:user")).toBeNull();
    expect(localStorage.getItem("auth:token")).toBeNull();
  });
});
