import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockLogout = vi.fn();
const mockUseAuthStore = vi.fn();
const mockUseStaffAssignments = vi.fn(() => false);

vi.mock('../../../src/app/store/auth.store', () => ({
  useAuthStore: (selector) => {
    if (typeof selector === 'function') {
      return selector(mockUseAuthStore());
    }
    return mockUseAuthStore();
  },
}));

vi.mock('../../../src/features/auth/hooks/useLogout', () => ({
  useLogout: () => ({ logout: mockLogout }),
}));

vi.mock('../../../src/hooks/useStaffAssignments', () => ({
  useStaffAssignments: () => mockUseStaffAssignments(),
}));

import { Sidebar } from '../../../src/features/dashboard/components/Sidebar';

const renderSidebar = () => {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Sidebar />
    </MemoryRouter>
  );
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('admin role', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: { roles: ['ROLE_ADMIN'] },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    it('shows all admin menu items', () => {
      renderSidebar();
      expect(screen.getByText('Panel General')).toBeInTheDocument();
      expect(screen.getByText('Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Accesos')).toBeInTheDocument();
      expect(screen.getByText('Eventos')).toBeInTheDocument();
      expect(screen.getByText('Funcionalidades')).toBeInTheDocument();
      expect(screen.getByText('Sesiones')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
      expect(screen.getByText('Catálogo de Eventos')).toBeInTheDocument();
    });

    it('does not show user-only menu items', () => {
      renderSidebar();
      expect(screen.queryByText('Mis Tickets')).not.toBeInTheDocument();
      expect(screen.queryByText('Mis Reembolsos')).not.toBeInTheDocument();
    });
  });

  describe('user role', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: { roles: ['ROLE_USER'] },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    it('shows only user-accessible menu items', () => {
      renderSidebar();
      expect(screen.getByText('Catálogo de Eventos')).toBeInTheDocument();
      expect(screen.getByText('Mis Tickets')).toBeInTheDocument();
      expect(screen.getByText('Mis Reembolsos')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });

    it('hides admin-only menu items', () => {
      renderSidebar();
      expect(screen.queryByText('Panel General')).not.toBeInTheDocument();
      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
      expect(screen.queryByText('Funcionalidades')).not.toBeInTheDocument();
      expect(screen.queryByText('Sesiones')).not.toBeInTheDocument();
    });
  });

  describe('organizer role', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: { roles: ['ROLE_ORGANIZER'] },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    it('shows organizer menu items', () => {
      renderSidebar();
      expect(screen.getByText('Eventos')).toBeInTheDocument();
      expect(screen.getByText('Catálogo de Eventos')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
    });

    it('does not show admin-only items', () => {
      renderSidebar();
      expect(screen.queryByText('Panel General')).not.toBeInTheDocument();
      expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
    });
  });

  describe('logout button', () => {
    beforeEach(() => {
      mockUseAuthStore.mockReturnValue({
        user: { roles: ['ROLE_ADMIN'] },
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    it('renders logout button', () => {
      renderSidebar();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    });

    it('calls logout when clicked', async () => {
      renderSidebar();
      const user = userEvent.setup();
      await user.click(screen.getByText('Cerrar Sesión'));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('staff assignments', () => {
    it('does not show staff item when no assignments', () => {
      mockUseStaffAssignments.mockReturnValue(false);
      mockUseAuthStore.mockReturnValue({
        user: { roles: ['ROLE_ORGANIZER'] },
        isAuthenticated: true,
        token: 'mock-token',
      });
      renderSidebar();
      expect(screen.queryByText('Operación / Check-in')).not.toBeInTheDocument();
    });

    it('shows staff item when user has assignments', () => {
      mockUseStaffAssignments.mockReturnValue(true);
      mockUseAuthStore.mockReturnValue({
        user: { roles: ['ROLE_ORGANIZER'] },
        isAuthenticated: true,
        token: 'mock-token',
      });
      renderSidebar();
      expect(screen.getByText('Operación / Check-in')).toBeInTheDocument();
    });
  });
});
