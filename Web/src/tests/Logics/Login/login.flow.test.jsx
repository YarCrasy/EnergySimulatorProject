import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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
import Login from '@/pages/login/Login.jsx';

describe('Login.jsx - submit flow', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    navigateMock.mockReset();
    setLocation({ state: undefined });
  });

  const completeFormAndSubmit = () => {
    fireEvent.change(screen.getByLabelText('Email corporativo'), {
      target: { value: 'user@corp.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'Strong123' },
    });
    const form = screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form);
  };

  it('redirige a administración cuando login devuelve rol admin', async () => {
    const login = vi.fn().mockResolvedValue({ id: 1, name: 'Admin', role: 'admin' });
    useAuth.mockReturnValue({ login });

    render(<Login />);
    completeFormAndSubmit();

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('user@corp.com', 'Strong123');
      expect(navigateMock).toHaveBeenCalledWith('/administration/users');
    });

    expect(createProject).not.toHaveBeenCalled();
  });

  it('redirige a proyectos cuando login devuelve rol user', async () => {
    const login = vi.fn().mockResolvedValue({ id: 7, name: 'Ana', role: 'user' });
    useAuth.mockReturnValue({ login });

    render(<Login />);
    completeFormAndSubmit();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/projects');
    });
    expect(createProject).not.toHaveBeenCalled();
  });

  it('si viene de CTA del simulador crea proyecto y navega por id', async () => {
    setLocation({ state: { redirectToSimulator: true } });
    const login = vi.fn().mockResolvedValue({ id: 22, name: 'Ana', role: 'user' });
    createProject.mockResolvedValueOnce({ id: 88 });
    useAuth.mockReturnValue({ login });

    render(<Login />);
    completeFormAndSubmit();

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
    setLocation({ state: { redirectToSimulator: true } });
    const login = vi.fn().mockResolvedValue({ id: 22, name: 'Ana', role: 'user' });
    createProject.mockResolvedValueOnce({});
    useAuth.mockReturnValue({ login });

    render(<Login />);
    completeFormAndSubmit();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/simulator');
    });
  });

  it('si createProject falla muestra alerta y redirige al fallback por rol', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    setLocation({ state: { redirectToSimulator: true } });

    const login = vi.fn().mockResolvedValue({ id: 5, name: 'Ana', role: 'user' });
    createProject.mockRejectedValueOnce(new Error('create failed'));
    useAuth.mockReturnValue({ login });

    render(<Login />);
    completeFormAndSubmit();

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('No se pudo iniciar el simulador. Intenta nuevamente.');
      expect(navigateMock).toHaveBeenCalledWith('/projects');
    });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('si login falla muestra alerta con el mensaje y no redirige', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const login = vi.fn().mockRejectedValue(new Error('Usuario o contraseña incorrectos'));
    useAuth.mockReturnValue({ login });

    render(<Login />);
    completeFormAndSubmit();

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Usuario o contraseña incorrectos');
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  it('bloquea doble submit mientras isSubmitting está activo', async () => {
    let resolveLogin;
    const login = vi.fn().mockImplementation(
      () => new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    useAuth.mockReturnValue({ login });

    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email corporativo'), {
      target: { value: 'user@corp.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: 'Strong123' },
    });

    const form = screen.getByRole('button', { name: 'Iniciar sesión' }).closest('form');
    expect(form).toBeTruthy();

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeDisabled();
    });

    fireEvent.submit(form);

    expect(login).toHaveBeenCalledTimes(1);

    resolveLogin({ id: 2, role: 'user' });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/projects');
      expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeEnabled();
    });
  });

  it('el botón "Crear cuenta" navega a /register', () => {
    useAuth.mockReturnValue({ login: vi.fn() });

    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(navigateMock).toHaveBeenCalledWith('/register');
  });
});
