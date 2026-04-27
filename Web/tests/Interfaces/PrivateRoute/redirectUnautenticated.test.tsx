import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from '@/components/privateRoute/PrivateRoute';

vi.mock('@/hooks/auth', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/hooks/auth';

afterEach(() => {
  vi.restoreAllMocks();
});

const renderPrivateRoute = ({
  authState,
  initialPath = '/private',
  privatePath = '/private',
  requiredRole,
  privateLabel = 'Privado',
} = {}) => {
  useAuth.mockReturnValue(authState);

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route
          path={privatePath}
          element={(
            <PrivateRoute role={requiredRole}>
              <div>{privateLabel}</div>
            </PrivateRoute>
          )}
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe('PrivateRoute.jsx', () => {
  it('redirige a /login si no hay usuario autenticado', () => {
    // Arrange
    renderPrivateRoute({
      authState: { user: null, loading: false },
    });

    // Assert
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Privado')).not.toBeInTheDocument();
  });

  it('renderiza el contenido privado cuando hay usuario autenticado', () => {
    // Arrange
    renderPrivateRoute({
      authState: { user: { id: 5, role: 'user' }, loading: false },
    });

    // Assert
    expect(screen.getByText('Privado')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('redirige a / cuando el rol requerido no coincide', () => {
    // Arrange
    renderPrivateRoute({
      authState: { user: { id: 7, role: 'user' }, loading: false },
      initialPath: '/admin',
      privatePath: '/admin',
      requiredRole: 'admin',
      privateLabel: 'Panel admin',
    });

    // Assert
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Panel admin')).not.toBeInTheDocument();
  });

  it('renderiza contenido cuando el rol requerido coincide', () => {
    // Arrange
    renderPrivateRoute({
      authState: { user: { id: 1, role: 'admin' }, loading: false },
      initialPath: '/admin',
      privatePath: '/admin',
      requiredRole: 'admin',
      privateLabel: 'Panel admin',
    });

    // Assert
    expect(screen.getByText('Panel admin')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('no renderiza children ni redirige mientras loading es true', () => {
    // Arrange
    renderPrivateRoute({
      authState: { user: { id: 15, role: 'admin' }, loading: true },
    });

    // Assert
    expect(screen.queryByText('Privado')).not.toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});
