import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, Calendar, Loader2, Save, UserCircle, IdCard, CheckCircle2 } from 'lucide-react';
import { registerSchema } from '../validations/auth.schema';
import { useRegister } from '../hooks/useRegister';
import { SignUpRequest } from '../types/auth.types';

export default function RegisterForm() {
  const { registerUser, isLoading, error, isSuccess } = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpRequest>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: SignUpRequest) => {
    registerUser(data);
  };

  const inputClasses = (isError: boolean) => `w-full pl-10 pr-4 py-2.5 bg-white/5 border ${isError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-md`;
  const iconClasses = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors";

  return (
    <div className="relative w-full max-w-4xl">
      {isSuccess && (
        <div className="absolute inset-0 z-50 bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 rounded-3xl">
          <CheckCircle2 className="text-green-400 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h3>
          <p className="text-gray-300">Redirigiendo al inicio de sesión...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Crea tu cuenta</h2>
          <p className="text-sm text-gray-400 mt-2">Únete a nuestra plataforma hoy mismo</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Documento</label>
            <div className="relative group">
              <div className={iconClasses}><IdCard size={18} /></div>
              <input type="text" className={inputClasses(!!errors.documento)} placeholder="Ej. 123456789" {...register('documento')} />
            </div>
            {errors.documento && <p className="mt-1 text-xs text-red-400 ml-1">{errors.documento.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Username</label>
            <div className="relative group">
              <div className={iconClasses}><UserCircle size={18} /></div>
              <input type="text" className={inputClasses(!!errors.username)} placeholder="mi_usuario" {...register('username')} />
            </div>
             {errors.username && <p className="mt-1 text-xs text-red-400 ml-1">{errors.username.message}</p>}
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Nombres</label>
            <div className="relative group">
              <div className={iconClasses}><User size={18} /></div>
              <input type="text" className={inputClasses(!!errors.nombres)} placeholder="Juan Carlos" {...register('nombres')} />
            </div>
            {errors.nombres && <p className="mt-1 text-xs text-red-400 ml-1">{errors.nombres.message}</p>}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Apellidos</label>
            <div className="relative group">
              <div className={iconClasses}><User size={18} /></div>
              <input type="text" className={inputClasses(!!errors.apellidos)} placeholder="Pérez Gómez" {...register('apellidos')} />
            </div>
             {errors.apellidos && <p className="mt-1 text-xs text-red-400 ml-1">{errors.apellidos.message}</p>}
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Fecha de Nacimiento</label>
            <div className="relative group">
              <div className={iconClasses}><Calendar size={18} /></div>
              <input style={{colorScheme: 'dark'}} type="date" className={inputClasses(!!errors.fechaNacimiento)} {...register('fechaNacimiento')} />
            </div>
            {errors.fechaNacimiento && <p className="mt-1 text-xs text-red-400 ml-1">{errors.fechaNacimiento.message}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Teléfono</label>
            <div className="relative group">
              <div className={iconClasses}><Phone size={18} /></div>
              <input type="tel" className={inputClasses(!!errors.telefono)} placeholder="3001234567" {...register('telefono')} />
            </div>
            {errors.telefono && <p className="mt-1 text-xs text-red-400 ml-1">{errors.telefono.message}</p>}
          </div>

           {/* Género */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Género</label>
             <div className="relative group">
              <select
                className={`w-full pl-4 pr-10 py-2.5 bg-white/5 border ${errors.genero ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500'} rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all backdrop-blur-md`}
                {...register('genero')}
              >
                <option value="" className="bg-gray-800">Seleccione...</option>
                <option value="masculino" className="bg-gray-800">Masculino</option>
                <option value="femenino" className="bg-gray-800">Femenino</option>
              </select>
            </div>
            {errors.genero && <p className="mt-1 text-xs text-red-400 ml-1">{errors.genero.message}</p>}
          </div>
          
          {/* Correo Acceso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Correo de Acceso</label>
            <div className="relative group">
              <div className={iconClasses}><Mail size={18} /></div>
              <input type="email" className={inputClasses(!!errors.correoAcceso)} placeholder="tu@correo.com" {...register('correoAcceso')} />
            </div>
            {errors.correoAcceso && <p className="mt-1 text-xs text-red-400 ml-1">{errors.correoAcceso.message}</p>}
          </div>

          {/* Clave Acceso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 ml-1">Clave de Acceso</label>
            <div className="relative group">
              <div className={iconClasses}><Lock size={18} /></div>
              <input type="password" className={inputClasses(!!errors.claveAcceso)} placeholder="Mínimo 8 caracteres" {...register('claveAcceso')} />
            </div>
            {errors.claveAcceso && <p className="mt-1 text-xs text-red-400 ml-1">{errors.claveAcceso.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto md:px-12 ml-auto mt-8 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          <span className="relative flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Registrarse'}
            {!isLoading && <Save size={18} className="group-hover:scale-110 transition-transform" />}
          </span>
        </button>
      </form>
    </div>
  );
}
