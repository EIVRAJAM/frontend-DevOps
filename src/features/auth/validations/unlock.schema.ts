import { z } from 'zod';

export const requestUnlockSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Correo electrónico inválido'),
});

export const unlockAccountSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Correo electrónico inválido'),
  code: z.string().length(6, 'El código debe tener exactamente 6 dígitos').regex(/^\d+$/, 'El código debe contener solo números'),
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'La confirmación es obligatoria'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type RequestUnlockFormValues = z.infer<typeof requestUnlockSchema>;
export type UnlockAccountFormValues = z.infer<typeof unlockAccountSchema>;
