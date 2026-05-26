import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockUseAuthStore = vi.fn();

vi.mock('../../../src/app/store/auth.store', () => ({
  useAuthStore: (selector) => {
    if (typeof selector === 'function') {
      return selector(mockUseAuthStore());
    }
    return mockUseAuthStore();
  },
}));

import { usePermissions } from '../../../src/hooks/usePermissions';

describe('usePermissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all false flags when user has no roles', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: [] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isOrganizer).toBe(false);
    expect(result.current.isUser).toBe(false);
    expect(result.current.roles).toEqual([]);
  });

  it('returns false flags when user is null', () => {
    mockUseAuthStore.mockReturnValue({ user: null });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isOrganizer).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  it('detects admin role correctly', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: ['ROLE_ADMIN'] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isOrganizer).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  it('detects organizer role correctly', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: ['ROLE_ORGANIZER'] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isOrganizer).toBe(true);
    expect(result.current.isUser).toBe(false);
  });

  it('detects user role correctly', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: ['ROLE_USER'] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isOrganizer).toBe(false);
    expect(result.current.isUser).toBe(true);
  });

  it('detects multiple roles', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: ['ROLE_ADMIN', 'ROLE_USER'] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isUser).toBe(true);
  });

  it('hasRole returns true for matching role', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: ['ROLE_ADMIN'] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasRole('ROLE_ADMIN')).toBe(true);
    expect(result.current.hasRole('ROLE_USER')).toBe(false);
  });

  it('hasAnyRole returns true if any match', () => {
    mockUseAuthStore.mockReturnValue({ user: { roles: ['ROLE_USER'] } });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER', 'ROLE_USER')).toBe(true);
    expect(result.current.hasAnyRole('ROLE_ADMIN', 'ROLE_ORGANIZER')).toBe(false);
  });
});
