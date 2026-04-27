import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { navigateMock, getLocation, setLocation } = vi.hoisted(() => {
  const navigate = vi.fn();
  let location = { state: undefined };
  return {
    navigateMock: navigate,
    getLocation: () => location,
    setLocation: (value) => { location = value; },
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => getLocation(),
  };
});

vi.mock('@/hooks/auth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/api/projects', () => ({
  createProject: vi.fn(),
}));

import { useAuth } from '@/hooks/auth';
import { createProject } from '@/api/projects';
import Login from '@/pages/login/Login';

const DEFAULT_EMAIL = 'user@corp.com';
const DEFAULT_PASSWORD = 'Strong123';

const renderLoginPage = ({ loginMock, locationState } = {}) => {
  setLocation({ state: locationState });
  useAuth.mockReturnValue({ login: loginMock ?? vi.fn() });
  render(<Login />);
  return userEvent.setup();
};

const submitLogin = async (
  user,
  { email = DEFAULT_EMAIL, password = DEFAULT_PASSWORD } = {},
) => {
  await user.type(screen.getByLabelText('Email corporativo'), email);
  await user.type(screen.getByLabelText('Contraseña'), password);
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
};

describe('Login.jsx - submit flow', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    navigateMock.mockReset();
    setLocation({ state: undefined });
  });

  it('redirige a administración cuando login devuelve rol admin', async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 1, name: 'Admin', role: 'admin' });
    const user = renderLoginPage({ loginMock: login });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('user@corp.com', 'Strong123');
      expect(navigateMock).toHaveBeenCalledWith('/administration/users');
    });

    expect(createProject).not.toHaveBeenCalled();
  });

  it('redirige a proyectos cuando login devuelve rol user', async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 7, name: 'Ana', role: 'user' });
    const user = renderLoginPage({ loginMock: login });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/projects');
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it('si viene de CTA del simulador crea proyecto y navega por id', async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 22, name: 'Ana', role: 'user' });
    createProject.mockResolvedValueOnce({ id: 88 });
    const user = renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: 'Nuevo Proyecto',
        energyEnough: false,
        energyNeeded: 0,
        userId: 22,
      });
      expect(navigateMock).toHaveBeenCalledWith('/simulator/88');
    });
  });

  it('si createProject no devuelve id navega a /simulator', async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 22, name: 'Ana', role: 'user' });
    createProject.mockResolvedValueOnce({});
    const user = renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/simulator');
    });
  });

  it('si createProject falla muestra alerta y redirige al fallback por rol', async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const login = vi.fn().mockResolvedValue({ id: 5, name: 'Ana', role: 'user' });
    createProject.mockRejectedValueOnce(new Error('create failed'));
    const user = renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('No se pudo iniciar el simulador. Intenta nuevamente.');
      expect(navigateMock).toHaveBeenCalledWith('/projects');
    });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('si login falla muestra alerta con el mensaje y no redirige', async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const login = vi.fn().mockRejectedValue(new Error('Usuario o contraseña incorrectos'));
    const user = renderLoginPage({ loginMock: login });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
      expect(navigateMock).not.toHaveBeenCalled();
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it('bloquea doble submit mientras isSubmitting está activo', async () => {
    // Arrange
    let resolveLogin;
    const login = vi.fn().mockImplementation(
      () => new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    const user = renderLoginPage({ loginMock: login });

    await user.type(screen.getByLabelText('Email corporativo'), DEFAULT_EMAIL);
    await user.type(screen.getByLabelText('Contraseña'), DEFAULT_PASSWORD);

    // Act
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeDisabled();
    });

    const form = screen.getByRole('button', { name: 'Ingresando...' }).closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form);

    // Assert
    expect(login).toHaveBeenCalledTimes(1);

    resolveLogin({ id: 2, role: 'user' });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/projects');
      expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeEnabled();
    });
  });

  it('si createProject falla para admin, navega al fallback de administración', async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const login = vi.fn().mockResolvedValue({ id: 2, name: 'Root', role: 'admin' });
    createProject.mockRejectedValueOnce(new Error('create failed'));
    const user = renderLoginPage({
      loginMock: login,
      locationState: { redirectToSimulator: true },
    });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('No se pudo iniciar el simulador. Intenta nuevamente.');
      expect(navigateMock).toHaveBeenCalledWith('/administration/users');
    });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('si el rol no es admin, aplica fallback por defecto a /projects', async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 7, name: 'Ana', role: undefined });
    const user = renderLoginPage({ loginMock: login });

    // Act
    await submitLogin(user);

    // Assert
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/projects');
    });
  });

  it('el botón "Crear cuenta" navega a /register', async () => {
    // Arrange
    const user = renderLoginPage({ loginMock: vi.fn() });

    // Act
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Assert
    expect(navigateMock).toHaveBeenCalledWith('/register');
  });

  it('si FormData no devuelve email/password usa strings vacíos', async () => {
    // Arrange
    const login = vi.fn().mockResolvedValue({ id: 11, role: 'user' });
    renderLoginPage({ loginMock: login });
    const form = screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form');
    expect(form).toBeTruthy();

    const originalGet = FormData.prototype.get;
    vi.spyOn(FormData.prototype, 'get').mockImplementation(function mockedGet(key) {
      if (key === 'email' || key === 'password') {
        return null;
      }
      return originalGet.call(this, key);
    });

    // Act
    fireEvent.submit(form);

    // Assert
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('', '');
      expect(navigateMock).toHaveBeenCalledWith('/projects');
    });
  });
});
