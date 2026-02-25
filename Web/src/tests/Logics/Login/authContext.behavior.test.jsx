import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';

import { AuthProvider } from '@/hooks/AuthContext.jsx';
import { useAuth } from '@/hooks/auth';
import api from '@api/api';

vi.mock('@api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

function AuthSnapshot({ onChange }) {
  const auth = useAuth();
  onChange(auth);
  return null;
}

describe('AuthProvider - login flow', () => {
  let auth;

  const mountProvider = () => {
    render(
      <AuthProvider>
        <AuthSnapshot onChange={(snapshot) => { auth = snapshot; }} />
      </AuthProvider>,
    );
  };

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    auth = null;
  });

  it('inicia con loading false y user null cuando no hay sesión', async () => {
    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
    });

    expect(auth.user).toBeNull();
    expect(localStorage.getItem('auth:user')).toBeNull();
  });

  it('hidrata usuario desde localStorage cuando la sesión es válida', async () => {
    localStorage.setItem('auth:user', JSON.stringify({
      id: 5,
      name: 'Ana',
      email: 'ana@corp.com',
      role: 'user',
    }));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toMatchObject({
        id: 5,
        name: 'Ana',
        email: 'ana@corp.com',
        role: 'user',
      });
    });
  });

  it('descarta sesión corrupta en localStorage', async () => {
    localStorage.setItem('auth:user', '{broken-json');

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toBeNull();
    });

    expect(localStorage.getItem('auth:user')).toBeNull();
  });

  it('login exitoso mapea admin=false a role user y persiste sesión', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 10,
        fullName: 'Lucia Vega',
        email: 'lucia@energy.com',
        admin: false,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    let result;
    await act(async () => {
      result = await auth.login('lucia@energy.com', '123456');
    });

    expect(api.post).toHaveBeenCalledWith('/users/login', {
      email: 'lucia@energy.com',
      password: '123456',
    });
    expect(result).toEqual({ id: 10, name: 'Lucia Vega', role: 'user' });

    await waitFor(() => {
      expect(auth.user).toEqual({
        id: 10,
        name: 'Lucia Vega',
        email: 'lucia@energy.com',
        role: 'user',
      });
    });

    expect(JSON.parse(localStorage.getItem('auth:user'))).toEqual({
      id: 10,
      name: 'Lucia Vega',
      email: 'lucia@energy.com',
      role: 'user',
    });
  });

  it('login usa fullName cuando name no viene en payload', async () => {
    // Arrange
    api.post.mockResolvedValueOnce({
      data: {
        id: 34,
        fullName: 'Usuario Solo FullName',
        email: 'solo.fullname@energy.com',
        admin: false,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    // Act
    let result;
    await act(async () => {
      result = await auth.login('solo.fullname@energy.com', 'pass');
    });

    // Assert
    expect(result).toEqual({
      id: 34,
      name: 'Usuario Solo FullName',
      role: 'user',
    });
    await waitFor(() => {
      expect(auth.user).toMatchObject({
        id: 34,
        name: 'Usuario Solo FullName',
      });
    });
  });

  it('login usa name vacío cuando backend no envía name ni fullName', async () => {
    // Arrange
    api.post.mockResolvedValueOnce({
      data: {
        id: 35,
        email: 'noname@energy.com',
        admin: false,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    // Act
    let result;
    await act(async () => {
      result = await auth.login('noname@energy.com', 'pass');
    });

    // Assert
    expect(result).toEqual({
      id: 35,
      name: '',
      role: 'user',
    });
    await waitFor(() => {
      expect(auth.user).toMatchObject({
        id: 35,
        name: '',
      });
    });
  });

  it('hidrata usando fullName cuando name no existe y aplica fallback vacío', async () => {
    // Arrange
    localStorage.setItem('auth:user', JSON.stringify({
      id: 6,
      fullName: 'Nombre Desde FullName',
      role: 'user',
    }));

    // Act
    mountProvider();

    // Assert
    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toMatchObject({
        id: 6,
        name: 'Nombre Desde FullName',
        email: '',
        role: 'user',
      });
    });
  });

  it('login exitoso mapea admin=true a role admin', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 1,
        fullName: 'Root Admin',
        email: 'admin@energy.com',
        admin: true,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    let result;
    await act(async () => {
      result = await auth.login('admin@energy.com', 'pass');
    });

    expect(result).toEqual({ id: 1, name: 'Root Admin', role: 'admin' });
    await waitFor(() => {
      expect(auth.user).toMatchObject({ id: 1, role: 'admin' });
    });
  });

  it('login fallido usa el mensaje del backend cuando existe', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Credenciales inválidas',
        },
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    await act(async () => {
      await expect(auth.login('x@x.com', 'bad')).rejects.toThrow('Credenciales inválidas');
    });
    expect(auth.user).toBeNull();
  });

  it('login fallido usa mensaje genérico cuando backend no devuelve detalle', async () => {
    api.post.mockRejectedValueOnce(new Error('network fail'));

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    await act(async () => {
      await expect(auth.login('x@x.com', 'bad')).rejects.toThrow('Usuario o contraseña incorrectos');
    });
    expect(auth.user).toBeNull();
  });

  it('logout limpia usuario y remueve sesión persistida', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 22,
        fullName: 'User',
        email: 'user@mail.com',
        admin: false,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));
    await act(async () => {
      await auth.login('user@mail.com', 'ok');
    });
    await waitFor(() => {
      expect(localStorage.getItem('auth:user')).not.toBeNull();
    });

    act(() => {
      auth.logout();
    });

    await waitFor(() => {
      expect(auth.user).toBeNull();
    });
    expect(localStorage.getItem('auth:user')).toBeNull();
  });
});
