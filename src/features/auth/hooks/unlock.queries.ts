import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { RequestUnlockRequest, UnlockAccountRequest, UnlockResponse } from '../types/unlock.types';
import { AxiosError } from 'axios';

export const useRequestAccountUnlock = () => {
  return useMutation<UnlockResponse, AxiosError<{ message: string }>, RequestUnlockRequest>({
    mutationFn: (payload: RequestUnlockRequest) => authService.requestAccountUnlock(payload),
  });
};

export const useUnlockAccount = () => {
  return useMutation<UnlockResponse, AxiosError<{ message: string }>, UnlockAccountRequest>({
    mutationFn: (payload: UnlockAccountRequest) => authService.unlockAccount(payload),
  });
};
