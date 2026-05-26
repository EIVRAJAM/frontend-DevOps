import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockUseAuthStore = vi.fn();

vi.mock('../../../src/app/store/auth.store', () => ({
  useAuthStore: (selector) => {
    if (typeof selector === 'function') {
      return selector(mockUseAuthStore());
    }
    return mockUseAuthStore();
  },
}));

import { RoleGuard } from '../../../src/components/common/RoleGuard';

const renderWithRouter = (component, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('RoleGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /login when not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    renderWithRouter(
      <RoleGuard allowedRoles={['ROLE_ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /unauthorized when role does not match', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['ROLE_USER'] },
    });
    renderWithRouter(
      <RoleGuard allowedRoles={['ROLE_ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when role matches', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['ROLE_ADMIN'] },
    });
    renderWithRouter(
      <RoleGuard allowedRoles={['ROLE_ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children when user has multiple roles and one matches', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['ROLE_USER', 'ROLE_ORGANIZER'] },
    });
    renderWithRouter(
      <RoleGuard allowedRoles={['ROLE_ORGANIZER']}>
        <div>Org Content</div>
      </RoleGuard>
    );
    expect(screen.getByText('Org Content')).toBeInTheDocument();
  });

  it('redirects to custom path when provided', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['ROLE_USER'] },
    });
    renderWithRouter(
      <RoleGuard allowedRoles={['ROLE_ADMIN']} redirectTo="/custom-error">
        <div>Protected</div>
      </RoleGuard>
    );
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('renders with multiple allowed roles', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { roles: ['ROLE_USER'] },
    });
    renderWithRouter(
      <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_ORGANIZER', 'ROLE_USER']}>
        <div>Multi Role Content</div>
      </RoleGuard>
    );
    expect(screen.getByText('Multi Role Content')).toBeInTheDocument();
  });
});
