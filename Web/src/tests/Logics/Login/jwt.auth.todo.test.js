import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';

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

const mountAuthProvider = (onSnapshot) => {
  render(
    React.createElement(
      AuthProvider,
      null,
      React.createElement(AuthSnapshot, { onChange: onSnapshot }),
    ),
  );
};

describe('Auth session contract', () => {
  let auth;

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    auth = null;
  });

  it('descarta sesión corrupta al iniciar y deja el estado en null', async () => {
    // Arrange
    localStorage.setItem('auth:user', '{broken-json');

    // Act
    mountAuthProvider((snapshot) => {
      auth = snapshot;
    });

    // Assert
    await waitFor(() => {
      expect(auth.loading).toBe(false);
    });
    expect(auth.user).toBeNull();
    expect(localStorage.getItem('auth:user')).toBeNull();
  });

  it('login exitoso persiste sesión y devuelve contrato mínimo', async () => {
    // Arrange
    api.post.mockResolvedValueOnce({
      data: {
        id: 25,
        fullName: 'Lucia Vega',
        email: 'lucia@corp.com',
        admin: false,
      },
    });

    mountAuthProvider((snapshot) => {
      auth = snapshot;
    });
    await waitFor(() => expect(auth.loading).toBe(false));

    // Act
    let loginResult;
    await act(async () => {
      loginResult = await auth.login('lucia@corp.com', '123456');
    });

    // Assert
    expect(api.post).toHaveBeenCalledWith('/users/login', {
      email: 'lucia@corp.com',
      password: '123456',
    });
    expect(loginResult).toEqual({ id: 25, name: 'Lucia Vega', role: 'user' });

    await waitFor(() => {
      expect(auth.user).toEqual({
        id: 25,
        name: 'Lucia Vega',
        email: 'lucia@corp.com',
        role: 'user',
      });
    });
    expect(JSON.parse(localStorage.getItem('auth:user'))).toEqual({
      id: 25,
      name: 'Lucia Vega',
      email: 'lucia@corp.com',
      role: 'user',
    });
  });

  it('login fallido usa mensaje del backend y no persiste sesión', async () => {
    // Arrange
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Credenciales inválidas',
        },
      },
    });

    mountAuthProvider((snapshot) => {
      auth = snapshot;
    });
    await waitFor(() => expect(auth.loading).toBe(false));

    // Act + Assert
    await act(async () => {
      await expect(auth.login('x@corp.com', 'bad')).rejects.toThrow('Credenciales inválidas');
    });
    expect(auth.user).toBeNull();
    expect(localStorage.getItem('auth:user')).toBeNull();
  });

  it('mapea admin=true al rol admin', async () => {
    // Arrange
    api.post.mockResolvedValueOnce({
      data: {
        id: 1,
        fullName: 'Root Admin',
        email: 'admin@corp.com',
        admin: true,
      },
    });

    mountAuthProvider((snapshot) => {
      auth = snapshot;
    });
    await waitFor(() => expect(auth.loading).toBe(false));

    // Act
    let loginResult;
    await act(async () => {
      loginResult = await auth.login('admin@corp.com', '123456');
    });

    // Assert
    expect(loginResult).toEqual({ id: 1, name: 'Root Admin', role: 'admin' });
    await waitFor(() => {
      expect(auth.user).toMatchObject({
        id: 1,
        role: 'admin',
      });
    });
  });

  it('logout es idempotente y limpia sesión persistida', async () => {
    // Arrange
    api.post.mockResolvedValueOnce({
      data: {
        id: 8,
        fullName: 'Ana User',
        email: 'ana@corp.com',
        admin: false,
      },
    });

    mountAuthProvider((snapshot) => {
      auth = snapshot;
    });
    await waitFor(() => expect(auth.loading).toBe(false));

    await act(async () => {
      await auth.login('ana@corp.com', 'ok');
    });
    await waitFor(() => {
      expect(localStorage.getItem('auth:user')).not.toBeNull();
    });

    // Act
    act(() => {
      auth.logout();
      auth.logout();
    });

    // Assert
    await waitFor(() => {
      expect(auth.user).toBeNull();
    });
    expect(localStorage.getItem('auth:user')).toBeNull();
  });
});
