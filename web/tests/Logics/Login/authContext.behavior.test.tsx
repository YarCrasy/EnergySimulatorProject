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

describe("tests/Logics/Login/AuthProvider", () => {
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

  it("inicia con loading false y user null cuando no hay sesion", async () => {
    // Arrange

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
    });
    expect(auth?.user).toBeNull();
    expect(auth?.token).toBeNull();
    expect(localStorage.getItem("auth:user")).toBeNull();
    expect(localStorage.getItem("auth:token")).toBeNull();
  });

  it("hidrata usuario desde localStorage cuando la sesion es valida", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      id: 5,
      name: "Ana",
      email: "ana@corp.com",
      role: "user",
    }));
    localStorage.setItem("auth:token", "token-123");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toMatchObject({
        id: 5,
        name: "Ana",
        email: "ana@corp.com",
        role: "user",
      });
    });
    expect(auth?.token).toBe("token-123");
  });

  it("descarta sesion corrupta en localStorage", async () => {
    // Arrange
    localStorage.setItem("auth:user", "{broken-json");
    localStorage.setItem("auth:token", "token-123");

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

  it("login exitoso mapea admin false a role user y persiste sesion", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        token: "token-user",
        user: {
          id: 10,
          fullName: "Lucia Vega",
          email: "lucia@energy.com",
          admin: false,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    let result: Awaited<ReturnType<NonNullable<typeof auth>["login"]>> | undefined;
    await act(async () => {
      result = await auth!.login("lucia@energy.com", "123456");
    });

    // Assert
    expect(api.post).toHaveBeenCalledWith("/users/login", {
      email: "lucia@energy.com",
      password: "123456",
    });
    expect(result).toEqual({ id: 10, name: "Lucia Vega", role: "user" });
    await waitFor(() => {
      expect(auth?.user).toEqual({
        id: 10,
        name: "Lucia Vega",
        email: "lucia@energy.com",
        role: "user",
      });
    });
    expect(JSON.parse(localStorage.getItem("auth:user")!)).toEqual({
      id: 10,
      name: "Lucia Vega",
      email: "lucia@energy.com",
      role: "user",
    });
    expect(localStorage.getItem("auth:token")).toBe("token-user");
  });

  it("login usa fullName cuando name no viene en payload", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        token: "token-34",
        user: {
          id: 34,
          fullName: "Usuario Solo FullName",
          email: "solo.fullname@energy.com",
          admin: false,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    let result: Awaited<ReturnType<NonNullable<typeof auth>["login"]>> | undefined;
    await act(async () => {
      result = await auth!.login("solo.fullname@energy.com", "pass");
    });

    // Assert
    expect(result).toEqual({
      id: 34,
      name: "Usuario Solo FullName",
      role: "user",
    });
    await waitFor(() => {
      expect(auth?.user).toMatchObject({
        id: 34,
        name: "Usuario Solo FullName",
      });
    });
  });

  it("login usa name vacio cuando backend no envia name ni fullName", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        token: "token-35",
        user: {
          id: 35,
          email: "noname@energy.com",
          admin: false,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    let result: Awaited<ReturnType<NonNullable<typeof auth>["login"]>> | undefined;
    await act(async () => {
      result = await auth!.login("noname@energy.com", "pass");
    });

    // Assert
    expect(result).toEqual({
      id: 35,
      name: "",
      role: "user",
    });
    await waitFor(() => {
      expect(auth?.user).toMatchObject({
        id: 35,
        name: "",
      });
    });
  });

  it("hidrata usando fullName cuando name no existe y aplica fallback vacio", async () => {
    // Arrange
    localStorage.setItem("auth:user", JSON.stringify({
      id: 6,
      fullName: "Nombre Desde FullName",
      role: "user",
    }));
    localStorage.setItem("auth:token", "token-6");

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth?.loading).toBe(false);
      expect(auth?.user).toMatchObject({
        id: 6,
        name: "Nombre Desde FullName",
        email: "",
        role: "user",
      });
    });
  });

  it("login exitoso mapea admin true a role admin", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        token: "token-admin",
        user: {
          id: 1,
          fullName: "Root Admin",
          email: "admin@energy.com",
          admin: true,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    let result: Awaited<ReturnType<NonNullable<typeof auth>["login"]>> | undefined;
    await act(async () => {
      result = await auth!.login("admin@energy.com", "pass");
    });

    // Assert
    expect(result).toEqual({ id: 1, name: "Root Admin", role: "admin" });
    await waitFor(() => {
      expect(auth?.user).toMatchObject({ id: 1, role: "admin" });
    });
  });

  it("login fallido usa el mensaje del backend cuando existe", async () => {
    // Arrange
    vi.mocked(api.post).mockRejectedValueOnce({
      response: {
        data: {
          message: "Credenciales invalidas",
        },
      },
      isAxiosError: true,
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    const result = act(async () => {
      await expect(auth!.login("x@x.com", "bad")).rejects.toThrow("Credenciales invalidas");
    });

    // Assert
    await result;
    expect(auth?.user).toBeNull();
  });

  it("login fallido usa mensaje generico cuando backend no devuelve detalle", async () => {
    // Arrange
    vi.mocked(api.post).mockRejectedValueOnce(new Error("network fail"));
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));

    // Act
    const result = act(async () => {
      await expect(auth!.login("x@x.com", "bad")).rejects.toThrow("Usuario o contrasena incorrectos");
    });

    // Assert
    await result;
    expect(auth?.user).toBeNull();
  });

  it("logout limpia usuario y remueve sesion persistida", async () => {
    // Arrange
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        token: "token-22",
        user: {
          id: 22,
          fullName: "User",
          email: "user@mail.com",
          admin: false,
        },
      },
    });
    mountProvider();
    await waitFor(() => expect(auth?.loading).toBe(false));
    await act(async () => {
      await auth!.login("user@mail.com", "ok");
    });
    await waitFor(() => {
      expect(localStorage.getItem("auth:user")).not.toBeNull();
    });

    // Act
    act(() => {
      auth!.logout();
    });

    // Assert
    await waitFor(() => {
      expect(auth?.user).toBeNull();
    });
    expect(localStorage.getItem("auth:user")).toBeNull();
    expect(localStorage.getItem("auth:token")).toBeNull();
  });
});
