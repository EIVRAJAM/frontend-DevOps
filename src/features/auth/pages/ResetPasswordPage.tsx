import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../validations/passwordReset.schema';
import { useResetPassword } from '../hooks/passwordReset.queries';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Loader2, ArrowLeft, KeyRound } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const backendError = error
    ? isAxiosError(error)
      ? (error.response?.data as { message?: string })?.message || 'Error al restablecer la contraseña'
      : 'Error inesperado al procesar la solicitud'
    : null;

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="text-white font-bold text-xl tracking-wider">DevOps<span className="text-indigo-500">App</span></div>
      </div>
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-xl shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Nueva Contraseña</h2>
        <p className="mt-2 text-sm text-gray-400">
          Ingresa el código que recibiste en tu correo junto con tu nueva contraseña.
        </p>
      </div>

      {isSuccess ? (
        <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-400">
          <KeyRound className="mx-auto mb-3 h-10 w-10 opacity-80" />
          <h3 className="mb-2 text-lg font-medium text-emerald-300">¡Contraseña actualizada!</h3>
          <p className="text-sm">Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {backendError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <strong>Atención:</strong> {backendError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register('email')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              aria-label="Correo electrónico"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
              Código de 6 dígitos
            </label>
            <input
              id="code"
              type="text"
              placeholder="123456"
              maxLength={6}
              {...register('code')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07] tracking-widest text-center"
              aria-label="Código de verificación"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-400">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              {...register('newPassword')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              aria-label="Nueva contraseña"
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              aria-label="Confirmar contraseña"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Restablecer Contraseña'
            )}
          </button>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a iniciar sesión
            </Link>
          </div>
        </form>
      )}
      </div>
    </div>
  );
};
