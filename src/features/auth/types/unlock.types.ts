export interface RequestUnlockRequest {
  email: string;
}

export interface UnlockAccountRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UnlockResponse {
  message: string;
  success: boolean;
}
