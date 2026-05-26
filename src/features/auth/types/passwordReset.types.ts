export interface ForgotPasswordRequest {
  correoAcceso: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetResponse {
  message: string;
  success: boolean;
}
