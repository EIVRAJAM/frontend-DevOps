import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../features/auth/types/auth.types';
import { extractRoles } from '../../utils/jwt.utils';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setCredentials: (token: string, userData: Omit<User, 'roles'>) => void;
  clearCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setCredentials: (token, userData) => {
        const roles = extractRoles(token);
        set({ token, user: { ...userData, roles }, isAuthenticated: true });
      },
      clearCredentials: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
