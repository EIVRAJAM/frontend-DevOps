import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { ResetPasswordRequest, PasswordResetResponse } from '../types/passwordReset.types';
import { AxiosError } from 'axios';

export const useRequestPasswordReset = () => {
  return useMutation<PasswordResetResponse, AxiosError<{ message: string }>, string>({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
};

export const useResetPassword = () => {
  return useMutation<PasswordResetResponse, AxiosError<{ message: string }>, ResetPasswordRequest>({
    mutationFn: (payload: ResetPasswordRequest) => authService.resetPassword(payload),
  });
};
