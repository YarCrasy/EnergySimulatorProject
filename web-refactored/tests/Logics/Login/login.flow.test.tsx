import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { navigateMock, getLocation, setLocation } = vi.hoisted(() => {
  const navigate = vi.fn();
  let location: { state: unknown } = { state: undefined };
  return {
    navigateMock: navigate,
    getLocation: () => location,
    setLocation: (value: { state: unknown }) => { location = value; },
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => getLocation(),
  };
});

vi.mock("@/auth/auth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/api/projects", () => ({
  createProject: vi.fn(),
}));

import { createProject } from "@/api/projects";
import { useAuth, type AuthContextValue } from "@/auth/auth";
import Login from "@/pages/login/Login";

const DEFAULT_EMAIL = "user@corp.com";
const DEFAULT_PASSWORD = "Strong123";

function renderLoginPage({
  loginMock,
  locationState,
}: {
  loginMock?: AuthContextValue["login"];
  locationState?: unknown;
} = {}) {
  setLocation({ state: locationState });
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    token: null,
    loading: false,
    isAuthenticated: false,
    login: loginMock ?? vi.fn(),
    logout: vi.fn(),
  });
  render(<Login />);
}

function fillCredentials({ email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD } = {}) {
  fireEvent.change(screen.getByLabelText("Email corporativo"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: password } });
}

function submitLogin() {
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("tests/Logics/Login/Login", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    navigateMock.mockReset();
    setLocation({ state: undefined });
  });

  it("redirige a administración cuando login devuelve rol admin", async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 1, name: "Admin", role: "admin" });
    renderLoginPage({ loginMock: login });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("user@corp.com", "Strong123");
      expect(navigateMock).toHaveBeenCalledWith("/administration/users");
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it("redirige a proyectos cuando login devuelve rol user", async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 7, name: "Ana", role: "user" });
    renderLoginPage({ loginMock: login });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/projects");
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it("si viene de CTA del simulador crea proyecto y navega por id", async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 22, name: "Ana", role: "user" });
    vi.mocked(createProject).mockResolvedValueOnce({ id: 88 });
    renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: "Nuevo Proyecto",
        energyEnough: false,
        energyNeeded: 0,
        userId: 22,
      });
      expect(navigateMock).toHaveBeenCalledWith("/simulator/88");
    });
  });

  it("si createProject no devuelve id navega a /simulator", async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 22, name: "Ana", role: "user" });
    vi.mocked(createProject).mockResolvedValueOnce({});
    renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/simulator");
    });
  });

  it("si createProject falla muestra alerta y redirige al fallback por rol", async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const login = vi.fn().mockResolvedValue({ id: 5, name: "Ana", role: "user" });
    vi.mocked(createProject).mockRejectedValueOnce(new Error("create failed"));
    renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("No se pudo iniciar el simulador. Intenta nuevamente.");
      expect(navigateMock).toHaveBeenCalledWith("/projects");
    });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("si login falla muestra alerta con el mensaje y no redirige", async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const login = vi.fn().mockRejectedValue(new Error("Usuario o contrasena incorrectos"));
    renderLoginPage({ loginMock: login });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Usuario o contrasena incorrectos");
      expect(navigateMock).not.toHaveBeenCalled();
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it("bloquea doble submit mientras isSubmitting esta activo", async () => {
    // Arrange
    let resolveLogin: ((value: { id: number; role: string }) => void) | undefined;
    const login = vi.fn().mockImplementation(
      () => new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    renderLoginPage({ loginMock: login });
    fillCredentials();

    // Act
    submitLogin();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ingresando..." })).toBeDisabled();
    });
    const form = screen.getByRole("button", { name: "Ingresando..." }).closest("form");
    fireEvent.submit(form!);

    // Assert
    expect(login).toHaveBeenCalledTimes(1);
    resolveLogin?.({ id: 2, role: "user" });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/projects");
      expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeEnabled();
    });
  });

  it("si createProject falla para admin, navega al fallback de administración", async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const login = vi.fn().mockResolvedValue({ id: 2, name: "Root", role: "admin" });
    vi.mocked(createProject).mockRejectedValueOnce(new Error("create failed"));
    renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("No se pudo iniciar el simulador. Intenta nuevamente.");
      expect(navigateMock).toHaveBeenCalledWith("/administration/users");
    });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("si el rol no es admin, aplica fallback por defecto a /projects", async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 7, name: "Ana", role: undefined });
    renderLoginPage({ loginMock: login });

    // Act
    fillCredentials();
    submitLogin();

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/projects");
    });
  });

  it("el boton Crear cuenta navega a /register", () => {
    // Arrange
    renderLoginPage({ loginMock: vi.fn() });

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

    // Assert
    expect(navigateMock).toHaveBeenCalledWith("/register");
  });

  it("si FormData no devuelve email o password usa strings vacios", async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 11, role: "user" });
    renderLoginPage({ loginMock: login });
    const form = screen.getByRole("button", { name: "Iniciar sesión" }).closest("form");
    const originalGet = FormData.prototype.get;
    vi.spyOn(FormData.prototype, "get").mockImplementation(function mockedGet(this: FormData, key) {
      if (key === "email" || key === "password") {
        return null;
      }
      return originalGet.call(this, key);
    });

    // Act
    fireEvent.submit(form!);

    // Assert
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("", "");
      expect(navigateMock).toHaveBeenCalledWith("/projects");
    });
  });
});
