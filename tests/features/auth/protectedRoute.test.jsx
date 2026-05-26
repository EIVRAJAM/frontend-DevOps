import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockUseAuthStore = vi.fn();

vi.mock('../../../src/app/store/auth.store', () => ({
  useAuthStore: (selector) => {
    if (typeof selector === 'function') {
      return selector(mockUseAuthStore());
    }
    return mockUseAuthStore();
  },
}));

import { ProtectedRoute } from '../../../src/features/auth/components/ProtectedRoute';

const renderWithRoute = (initialEntry = '/dashboard') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<div>Dashboard Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    renderWithRoute();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard Content')).not.toBeInTheDocument();
  });

  it('renders child routes when authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['ROLE_ADMIN'] },
      token: 'valid-token',
    });
    renderWithRoute();
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects when token exists but isAuthenticated is false', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      token: 'expired-token',
    });
    renderWithRoute();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
