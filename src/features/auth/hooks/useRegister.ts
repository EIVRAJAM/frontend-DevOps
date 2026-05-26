import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { SignUpRequest } from '../types/auth.types';
import axios from 'axios';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (userData: SignUpRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(userData);
      setIsSuccess(true);
      
      // Delay redirection so success UI can be seen
      setTimeout(() => {
        navigate('/login?registered=true');
      }, 2500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Ocurrió un error en el registro. Validaciones fallidas.');
      } else {
        setError('Ocurrió un error inesperado al registrar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { registerUser, isLoading, error, isSuccess };
};
