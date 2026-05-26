import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../app/store/auth.store';
import { LoginRequest } from '../types/auth.types';
import { extractRoles } from '../../../utils/jwt.utils';
import { ROLES } from '../../../config/roles';
import axios from 'axios';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const loginUser = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.login(credentials);
      setCredentials(res.token || '', { username: res.username || credentials.usernameOrEmail });
      
      // Dejamos que RootRedirect (AppRouter.tsx) maneje a dónde debe ir
      // según su rol.
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { loginUser, isLoading, error };
};
