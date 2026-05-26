import { z } from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'El correo o username es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

export const registerSchema = z.object({
  documento: z.string().min(1, 'El documento es obligatorio'),
  nombres: z.string().min(1, 'Los nombres son obligatorios'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
  genero: z.enum(['masculino', 'femenino'], {
    errorMap: () => ({ message: 'El género debe ser masculino o femenino' })
  }),
  fechaNacimiento: z.string().min(1, 'La fecha es obligatoria').refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date < new Date();
  }, { message: 'Debe ser una fecha válida del pasado' }),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
  username: z.string().min(1, 'El username es obligatorio'),
  correoAcceso: z.string().min(1, 'El correo es obligatorio').email('Debe ser un correo válido'),
  claveAcceso: z.string().min(8, 'La clave debe tener al menos 8 caracteres')
});
