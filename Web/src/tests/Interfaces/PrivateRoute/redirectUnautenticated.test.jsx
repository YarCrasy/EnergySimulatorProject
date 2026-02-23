import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from '@/components/privateRoute/PrivateRoute.jsx';

vi.mock('@/hooks/auth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/hooks/auth';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('PrivateRoute.jsx', () => {
  it('redirige a /login si no hay usuario autenticado', async () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/login" element={<div>Login</div>} />
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Privado</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Privado')).not.toBeInTheDocument();
  });

  it('renderiza el contenido privado cuando hay usuario autenticado', async () => {
    useAuth.mockReturnValue({ user: { id: 5, role: 'user' }, loading: false });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/login" element={<div>Login</div>} />
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Privado</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Privado')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('redirige a / cuando el rol requerido no coincide', async () => {
    useAuth.mockReturnValue({ user: { id: 7, role: 'user' }, loading: false });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <div>Panel admin</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Panel admin')).not.toBeInTheDocument();
  });

  it('no renderiza children mientras loading es true', () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>Privado</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Privado')).not.toBeInTheDocument();
  });
});
