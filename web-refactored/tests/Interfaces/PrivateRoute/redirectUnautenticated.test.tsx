import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";

vi.mock("@/Routes", () => ({
  publicRoutes: [
    { path: "/", element: <div>Home</div> },
    { path: "/login", element: <div>Login</div> },
  ],
  protectedRoutes: [
    { path: "/projects", element: <div>Privado</div> },
  ],
}));

vi.mock("@/components/header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("@/components/footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("@/components/spiner/Spiner", () => ({
  default: ({ text = "Loading..." }: { text?: string }) => <div>{text}</div>,
}));

vi.mock("@/pages/not-found/NotFound", () => ({
  default: () => <div>Not found</div>,
}));

vi.mock("@/api/users", () => ({
  getAllUsers: vi.fn().mockResolvedValue([]),
  deleteUser: vi.fn(),
}));

vi.mock("@/api/elements", () => ({
  getAllElements: vi.fn().mockResolvedValue([]),
  createElement: vi.fn(),
  updateElement: vi.fn(),
  deleteElement: vi.fn(),
}));

import App from "@/App";
import { AuthContext, type AuthContextValue } from "@/auth/auth";
import AdminBase from "@/pages/admin/AdminBase";

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

function renderApp(authState: AuthContextValue, initialPath = "/projects") {
  return render(
    <AuthContext.Provider value={authState}>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

function renderAdmin(authState: AuthContextValue, initialPath = "/administration/users") {
  return render(
    <AuthContext.Provider value={authState}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/projects" element={<div>Projects</div>} />
          <Route path="/administration/users" element={<AdminBase view="users" />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("tests/Interfaces/PrivateRoute", () => {
  it("redirige a /login si no hay usuario autenticado", () => {
    // Arrange
    const authState: AuthContextValue = {
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    };

    // Act
    renderApp(authState);

    // Assert
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Privado")).not.toBeInTheDocument();
  });

  it("renderiza el contenido privado cuando hay usuario autenticado", () => {
    // Arrange
    const authState: AuthContextValue = {
      user: { id: 5, name: "User", email: "user@test.com", role: "user" },
      token: "token",
      loading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    };

    // Act
    renderApp(authState);

    // Assert
    expect(screen.getByText("Privado")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("redirige a /projects cuando el rol requerido no coincide", () => {
    // Arrange
    const authState: AuthContextValue = {
      user: { id: 7, name: "User", email: "user@test.com", role: "user" },
      token: "token",
      loading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    };

    // Act
    renderAdmin(authState);

    // Assert
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.queryByText("Usuarios")).not.toBeInTheDocument();
  });

  it("renderiza contenido cuando el rol requerido coincide", async () => {
    // Arrange
    const authState: AuthContextValue = {
      user: { id: 1, name: "Admin", email: "admin@test.com", role: "admin" },
      token: "token",
      loading: false,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    };

    // Act
    renderAdmin(authState);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Usuarios" })).toBeInTheDocument();
    });
    expect(screen.queryByText("Projects")).not.toBeInTheDocument();
  });

  it("no renderiza children ni redirige mientras loading es true", () => {
    // Arrange
    const authState: AuthContextValue = {
      user: { id: 15, name: "Admin", email: "admin@test.com", role: "admin" },
      token: "token",
      loading: true,
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    };

    // Act
    renderApp(authState);

    // Assert
    expect(screen.getByText("Cargando sesion...")).toBeInTheDocument();
    expect(screen.queryByText("Privado")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });
});
