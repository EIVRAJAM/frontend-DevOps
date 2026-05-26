import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { accesoService } from '../../accesos/services/acceso.service';
import { Loader2, KeyRound, CheckCircle } from 'lucide-react';

const schema = z.object({
  passwordActual: z.string().min(1, 'La contraseña actual es obligatoria'),
  passwordNueva: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma la contraseña'),
}).refine((data) => data.passwordNueva === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof schema>;

export const ChangePasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await accesoService.cambiarPassword({
        passwordActual: data.passwordActual,
        passwordNueva: data.passwordNueva,
      });
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
        <CheckCircle className="h-10 w-10 text-emerald-400" />
        <p className="text-sm font-medium text-emerald-300">Contraseña actualizada correctamente</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-xs text-emerald-400 hover:text-emerald-300 underline transition-colors"
        >
          Cambiar de nuevo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <KeyRound size={18} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">Cambiar Contraseña</h3>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Contraseña Actual</label>
        <input
          type="password"
          {...register('passwordActual')}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/60"
        />
        {errors.passwordActual && <p className="mt-1 text-xs text-red-400">{errors.passwordActual.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Nueva Contraseña</label>
        <input
          type="password"
          {...register('passwordNueva')}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/60"
        />
        {errors.passwordNueva && <p className="mt-1 text-xs text-red-400">{errors.passwordNueva.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/60"
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
        {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
      </button>
    </form>
  );
};
