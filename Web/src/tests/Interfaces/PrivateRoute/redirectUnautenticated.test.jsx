import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock correcto del hook
vi.mock('@/hooks/auth', () => ({
  useAuth: () => ({ user: null, loading: false })
}));

import PrivateRoute from '@/components/PrivateRoute/PrivateRoute.jsx';

afterEach(() => vi.restoreAllMocks());

describe('PrivateRoute - redirect when unauthenticated', () => {
  it('should redirect to /login when user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>LOGIN PAGE</div>} />
          <Route path="/protected" element={<PrivateRoute><div>PROTECTED</div></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
  });
});
