import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/utils/jwt.utils', () => ({
  extractRoles: (token) => {
    if (token === 'admin-token') return ['ROLE_ADMIN'];
    if (token === 'user-token') return ['ROLE_USER'];
    if (token === 'org-token') return ['ROLE_ORGANIZER'];
    return [];
  },
  extractSubject: vi.fn(),
}));

import { useAuthStore } from '../../../src/app/store/auth.store';

describe('auth.store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.token).toBe(null);
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it('setCredentials updates token, user, and isAuthenticated', () => {
    useAuthStore.getState().setCredentials('admin-token', { username: 'admin' });

    const state = useAuthStore.getState();
    expect(state.token).toBe('admin-token');
    expect(state.user.username).toBe('admin');
    expect(state.user.roles).toEqual(['ROLE_ADMIN']);
    expect(state.isAuthenticated).toBe(true);
  });

  it('setCredentials extracts roles from token', () => {
    useAuthStore.getState().setCredentials('user-token', { username: 'user' });

    const state = useAuthStore.getState();
    expect(state.user.roles).toEqual(['ROLE_USER']);
  });

  it('setCredentials for organizer token extracts ROLE_ORGANIZER', () => {
    useAuthStore.getState().setCredentials('org-token', { username: 'organizer' });

    const state = useAuthStore.getState();
    expect(state.user.roles).toEqual(['ROLE_ORGANIZER']);
  });

  it('clearCredentials resets state to initial', () => {
    useAuthStore.getState().setCredentials('admin-token', { username: 'admin' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().clearCredentials();

    const state = useAuthStore.getState();
    expect(state.token).toBe(null);
    expect(state.user).toBe(null);
    expect(state.isAuthenticated).toBe(false);
  });

  it('setCredentials preserves additional userData fields', () => {
    useAuthStore.getState().setCredentials('admin-token', {
      username: 'admin',
      email: 'admin@test.com',
    });

    const state = useAuthStore.getState();
    expect(state.user.username).toBe('admin');
    expect(state.user.email).toBe('admin@test.com');
  });

  it('setCredentials with empty roles token still sets authenticated', () => {
    useAuthStore.getState().setCredentials('empty-token', { username: 'no-roles' });

    const state = useAuthStore.getState();
    expect(state.user.roles).toEqual([]);
    expect(state.isAuthenticated).toBe(true);
  });

  it('persists auth state to localStorage under auth-storage key', () => {
    useAuthStore.getState().setCredentials('admin-token', { username: 'admin' });

    const stored = localStorage.getItem('auth-storage');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored);
    expect(parsed.state.token).toBe('admin-token');
  });
});
