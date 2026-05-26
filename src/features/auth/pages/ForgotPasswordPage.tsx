import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../validations/passwordReset.schema';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { requestReset, isLoading, isSuccess, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      correoAcceso: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    requestReset(data.correoAcceso);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="text-white font-bold text-xl tracking-wider">DevOps<span className="text-indigo-500">App</span></div>
      </div>
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-xl shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white">Recuperar Contraseña</h2>
        <p className="mt-2 text-sm text-gray-400">
          Ingresa tu correo y te enviaremos instrucciones.
        </p>
      </div>

      {isSuccess ? (
        <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-400">
          <MailCheck className="mx-auto mb-3 h-10 w-10 opacity-80" />
          <h3 className="mb-2 text-lg font-medium text-emerald-300">¡Revisa tu bandeja!</h3>
          <p className="text-sm">Si el correo está registrado, recibirás un código de verificación de 6 dígitos.</p>
          <div className="mt-6">
            <Link to="/reset-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Ya tengo mi código, restablecer contraseña
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <strong>Atención:</strong> {error}
            </div>
          )}

          <div>
            <label htmlFor="correoAcceso" className="block text-sm font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              id="correoAcceso"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register('correoAcceso')}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              aria-label="Correo electrónico para recuperar contraseña"
            />
            {errors.correoAcceso && (
              <p className="mt-1 text-xs text-red-400">{errors.correoAcceso.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Recuperar Contraseña'
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
