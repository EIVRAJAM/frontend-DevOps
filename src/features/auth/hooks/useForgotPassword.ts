import { useRequestPasswordReset } from './passwordReset.queries';
import { isAxiosError } from 'axios';

export const useForgotPassword = () => {
  const { mutate, isPending, isSuccess, error } = useRequestPasswordReset();

  const backendError = error
    ? isAxiosError(error)
      ? error.response?.data?.message || 'Error al solicitar la recuperación'
      : 'Error inesperado al procesar la solicitud'
    : null;

  const requestReset = (email: string) => {
    mutate(email);
  };

  return {
    requestReset,
    isLoading: isPending,
    isSuccess,
    error: backendError,
  };
};
