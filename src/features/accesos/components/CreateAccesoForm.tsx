import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateAccesoAdminRequest } from '../types/acceso.types';

const schema = z.object({
  idUsuario: z.number({ message: 'El ID de Usuario es requerido' }).min(1),
  username: z.string().min(3, 'Mínimo 3 caracteres').max(50),
  correoAcceso: z.string().email('Correo inválido'),
});

type FormValues = z.infer<typeof schema>;

interface CreateAccesoFormProps {
  onSubmit: (data: CreateAccesoAdminRequest) => Promise<void>;
  isLoading?: boolean;
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
const errorClass = 'mt-1 text-xs text-red-400';

export const CreateAccesoForm: React.FC<CreateAccesoFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>ID Usuario</label>
        <input
          type="number"
          {...register('idUsuario', { valueAsNumber: true })}
          className={inputClass}
          placeholder="123"
        />
        {errors.idUsuario && <p className={errorClass}>{errors.idUsuario.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Username</label>
        <input {...register('username')} className={inputClass} placeholder="jperez" />
        {errors.username && <p className={errorClass}>{errors.username.message}</p>}
      </div>
      <div>
        <label className={labelClass}>Correo de Acceso</label>
        <input {...register('correoAcceso')} className={inputClass} placeholder="jperez@email.com" />
        {errors.correoAcceso && <p className={errorClass}>{errors.correoAcceso.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Creando...' : 'Crear Acceso'}
        </button>
      </div>
    </form>
  );
};
