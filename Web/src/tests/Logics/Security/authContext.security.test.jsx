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

describe('AuthProvider - security hardening', () => {
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

  it('sanitiza payload con script al hidratar sesión desde localStorage', async () => {
    localStorage.setItem('auth:user', JSON.stringify({
      id: 9,
      name: 'Ana<script>alert("x")</script>',
      email: 'ana@corp.com<script>alert("x")</script>',
      role: 'admin',
    }));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toEqual({
        id: 9,
        name: 'Ana',
        email: 'ana@corp.com',
        role: 'admin',
      });
    });
  });

  it('login exitoso sanitiza campos para evitar inyección de scripts', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 33,
        fullName: 'Eva<script>alert("hack")</script>',
        email: 'eva@energy.com<script>alert("hack")</script>',
        admin: false,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    let result;
    await act(async () => {
      result = await auth.login('eva@energy.com', '123456');
    });

    expect(result).toEqual({ id: 33, name: 'Eva', role: 'user' });
    await waitFor(() => {
      expect(auth.user).toEqual({
        id: 33,
        name: 'Eva',
        email: 'eva@energy.com',
        role: 'user',
      });
    });
    expect(localStorage.getItem('auth:user')).not.toContain('<script');
  });

  it('normaliza rol manipulado en localStorage para evitar escalación por role tampering', async () => {
    localStorage.setItem('auth:user', JSON.stringify({
      id: 77,
      name: 'Tampered User',
      email: 'tampered@corp.com',
      role: 'super-admin',
    }));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toMatchObject({
        id: 77,
        role: 'user',
      });
    });
  });

  it('elimina prefijos javascript: y tags HTML al hidratar sesión', async () => {
    localStorage.setItem('auth:user', JSON.stringify({
      id: 88,
      name: '<b>Ana</b> javascript:alert(1)',
      email: 'javascript:ana@corp.com',
      role: 'user',
    }));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user.name).not.toContain('<');
      expect(auth.user.name).not.toContain('javascript:');
      expect(auth.user.email).toBe('ana@corp.com');
    });
  });

  it('descarta sesión manipulada sin id y limpia persistencia', async () => {
    localStorage.setItem('auth:user', JSON.stringify({
      name: 'Missing Id',
      email: 'missing@corp.com',
      role: 'admin',
    }));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toBeNull();
    });
    expect(localStorage.getItem('auth:user')).toBeNull();
  });

  it('descarta sesión cuando localStorage contiene un valor no-objeto', async () => {
    localStorage.setItem('auth:user', JSON.stringify('texto-plano'));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toBeNull();
    });
    expect(localStorage.getItem('auth:user')).toBeNull();
  });

  it('normaliza campos no-string a string vacío durante hidratación', async () => {
    localStorage.setItem('auth:user', JSON.stringify({
      id: 44,
      name: 1234,
      email: null,
      role: 'admin',
    }));

    mountProvider();

    await waitFor(() => {
      expect(auth.loading).toBe(false);
      expect(auth.user).toEqual({
        id: 44,
        name: '',
        email: '',
        role: 'admin',
      });
    });
  });

  it('si backend responde login sin id no persiste sesión y falla de forma controlada', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        fullName: 'No Id',
        email: 'noid@corp.com',
        admin: false,
      },
    });

    mountProvider();
    await waitFor(() => expect(auth.loading).toBe(false));

    await act(async () => {
      await expect(auth.login('noid@corp.com', 'secret')).rejects.toThrow(
        'Usuario o contraseña incorrectos',
      );
    });

    expect(auth.user).toBeNull();
    expect(localStorage.getItem('auth:user')).toBeNull();
  });
});
