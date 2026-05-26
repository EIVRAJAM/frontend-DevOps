import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/auth.store';
import { authService } from '../services/auth.service';
import { useCallback } from 'react';

export const useLogout = () => {
  const navigate = useNavigate();
  const clearCredentials = useAuthStore(state => state.clearCredentials);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Token invalidation failed, proceed with local cleanup anyway
    }
    
    clearCredentials();
    navigate('/login', { replace: true });
  }, [clearCredentials, navigate]);

  return { logout };
};
