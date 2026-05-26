import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../../../src/features/auth/validations/auth.schema';
import { forgotPasswordSchema, resetPasswordSchema } from '../../../src/features/auth/validations/passwordReset.schema';
import { requestUnlockSchema, unlockAccountSchema } from '../../../src/features/auth/validations/unlock.schema';

describe('Zod Schemas', () => {
  describe('loginSchema', () => {
    it('validates valid login data', () => {
      const result = loginSchema.safeParse({ usernameOrEmail: 'admin', password: 'pass123' });
      expect(result.success).toBe(true);
    });

    it('rejects empty usernameOrEmail', () => {
      const result = loginSchema.safeParse({ usernameOrEmail: '', password: 'pass' });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toContain('usernameOrEmail');
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({ usernameOrEmail: 'admin', password: '' });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toContain('password');
    });
  });

  describe('registerSchema', () => {
    const validData = {
      documento: '123456789',
      nombres: 'Juan',
      apellidos: 'Perez',
      genero: 'masculino',
      fechaNacimiento: '1990-01-01',
      telefono: '3001234567',
      username: 'juanperez',
      correoAcceso: 'juan@test.com',
      claveAcceso: 'password123',
    };

    it('validates valid registration data', () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = registerSchema.safeParse({ ...validData, correoAcceso: 'not-an-email' });
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const result = registerSchema.safeParse({ ...validData, claveAcceso: 'short' });
      expect(result.success).toBe(false);
    });

    it('rejects future date of birth', () => {
      const result = registerSchema.safeParse({ ...validData, fechaNacimiento: '2099-01-01' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid gender', () => {
      const result = registerSchema.safeParse({ ...validData, genero: 'other' });
      expect(result.success).toBe(false);
    });

    it('validates password exactly 8 characters', () => {
      const result = registerSchema.safeParse({ ...validData, claveAcceso: '12345678' });
      expect(result.success).toBe(true);
    });
  });

  describe('resetPasswordSchema', () => {
    const validData = {
      email: 'user@test.com',
      code: '123456',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    };

    it('validates matching passwords', () => {
      const result = resetPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const result = resetPasswordSchema.safeParse({ ...validData, confirmPassword: 'different' });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].path).toContain('confirmPassword');
    });

    it('rejects code with wrong length', () => {
      const result = resetPasswordSchema.safeParse({ ...validData, code: '12345' });
      expect(result.success).toBe(false);
    });

    it('rejects code with non-digits', () => {
      const result = resetPasswordSchema.safeParse({ ...validData, code: 'abc123' });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('validates valid email', () => {
      const result = forgotPasswordSchema.safeParse({ correoAcceso: 'test@test.com' });
      expect(result.success).toBe(true);
    });

    it('rejects empty email', () => {
      const result = forgotPasswordSchema.safeParse({ correoAcceso: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('unlockAccountSchema', () => {
    const validData = {
      email: 'user@test.com',
      code: '123456',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    };

    it('validates valid unlock data', () => {
      const result = unlockAccountSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const result = unlockAccountSchema.safeParse({ ...validData, confirmPassword: 'wrong' });
      expect(result.success).toBe(false);
    });
  });

  describe('requestUnlockSchema', () => {
    it('validates valid email', () => {
      const result = requestUnlockSchema.safeParse({ email: 'test@test.com' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = requestUnlockSchema.safeParse({ email: 'not-email' });
      expect(result.success).toBe(false);
    });
  });
});
