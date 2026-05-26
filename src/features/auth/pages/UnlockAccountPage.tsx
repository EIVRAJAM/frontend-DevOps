import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequestAccountUnlock, useUnlockAccount } from '../hooks/unlock.queries';
import { isAxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Lock, MailCheck } from 'lucide-react';
import {
  requestUnlockSchema,
  RequestUnlockFormValues,
  unlockAccountSchema,
  UnlockAccountFormValues,
} from '../validations/unlock.schema';

export const UnlockAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const requestMutation = useRequestAccountUnlock();
  const verifyMutation = useUnlockAccount();

  const requestForm = useForm<RequestUnlockFormValues>({
    resolver: zodResolver(requestUnlockSchema),
    defaultValues: { email: '' },
  });

  const verifyForm = useForm<UnlockAccountFormValues>({
    resolver: zodResolver(unlockAccountSchema),
    defaultValues: { email: '', code: '', newPassword: '', confirmPassword: '' },
  });

  const handleRequest = (data: RequestUnlockFormValues) => {
    setUserEmail(data.email);
    requestMutation.mutate({ email: data.email }, {
      onSuccess: () => {
        setCodeSent(true);
        verifyForm.setValue('email', data.email);
      },
    });
  };

  const handleVerify = (data: UnlockAccountFormValues) => {
    verifyMutation.mutate(data, {
      onSuccess: () => {
        setTimeout(() => navigate('/login'), 3000);
      },
    });
  };

  const requestError = requestMutation.error
    ? isAxiosError(requestMutation.error)
      ? requestMutation.error.response?.data?.message || 'Error al solicitar el desbloqueo'
      : 'Error inesperado'
    : null;

  const verifyError = verifyMutation.error
    ? isAxiosError(verifyMutation.error)
      ? (verifyMutation.error.response?.data as { message?: string })?.message || 'Error al desbloquear la cuenta'
      : 'Error inesperado'
    : null;

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="text-white font-bold text-xl tracking-wider">DevOps<span className="text-indigo-500">App</span></div>
      </div>
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Desbloquear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-400">
            {codeSent
              ? `Ingresa el código enviado a ${userEmail} y tu nueva contraseña.`
              : 'Ingresa tu correo para recibir el código de desbloqueo.'}
          </p>
        </div>

        {verifyMutation.isSuccess ? (
          <div className="animate-in fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-emerald-400">
            <Lock className="mx-auto mb-3 h-10 w-10 opacity-80" />
            <h3 className="mb-2 text-lg font-medium text-emerald-300">¡Cuenta desbloqueada!</h3>
            <p className="text-sm">Redirigiendo al inicio de sesión...</p>
          </div>
        ) : !codeSent ? (
          <form onSubmit={requestForm.handleSubmit(handleRequest)} className="space-y-6">
            {requestError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {requestError}
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
                {...requestForm.register('email')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              />
              {requestForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-400">{requestForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={requestMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {requestMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
              ) : (
                'Solicitar Desbloqueo'
              )}
            </button>

            <div className="text-center mt-4">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a iniciar sesión
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={verifyForm.handleSubmit(handleVerify)} className="space-y-4">
            {verifyError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {verifyError}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                Código de 6 dígitos
              </label>
              <input
                id="code"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...verifyForm.register('code')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07] tracking-widest text-center"
              />
              {verifyForm.formState.errors.code && (
                <p className="mt-1 text-xs text-red-400">{verifyForm.formState.errors.code.message}</p>
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
                {...verifyForm.register('newPassword')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              />
              {verifyForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-400">{verifyForm.formState.errors.newPassword.message}</p>
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
                {...verifyForm.register('confirmPassword')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]"
              />
              {verifyForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{verifyForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50 mt-4"
            >
              {verifyMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Desbloqueando...</>
              ) : (
                'Desbloquear Cuenta'
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setCodeSent(false)}
                className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Cambiar correo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
