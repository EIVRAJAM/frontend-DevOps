import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockClearCredentials = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../src/app/store/auth.store', () => ({
  useAuthStore: (selector) => {
    const state = {
      token: 'mock-token',
      user: { username: 'admin', roles: ['ROLE_ADMIN'] },
      isAuthenticated: true,
      setCredentials: vi.fn(),
      clearCredentials: mockClearCredentials,
    };
    if (typeof selector === 'function') {
      return selector(state);
    }
    return state;
  },
}));

vi.mock('../../../src/features/auth/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: () => mockLogout(),
  },
}));

import { useLogout } from '../../../src/features/auth/hooks/useLogout';

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogout.mockResolvedValue(undefined);
  });

  it('calls clearCredentials on logout', async () => {
    const wrapper = ({ children }) => (
      <MemoryRouter>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockClearCredentials).toHaveBeenCalledTimes(1);
  });

  it('navigates to /login after logout', async () => {
    const wrapper = ({ children }) => (
      <MemoryRouter>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('clears credentials even if logout API fails', async () => {
    mockLogout.mockRejectedValue(new Error('Network error'));
    const wrapper = ({ children }) => (
      <MemoryRouter>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockClearCredentials).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
