import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { UsuarioCreateRequest } from '../types/usuario.types';
import { accesoService } from '../../accesos/services/acceso.service';
import { Loader2, CheckCircle } from 'lucide-react';

const userSchema = z.object({
  documento: z.string().min(1, 'El documento es requerido').max(20),
  nombres: z.string().min(1, 'Los nombres son requeridos'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  genero: z.enum(['masculino', 'femenino'], { message: 'Selecciona un género válido' }),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  nombreRol: z.string().min(1, 'El rol es requerido'),
});

const accesoInlineSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(50),
  correoAcceso: z.string().email('Correo inválido'),
});

type UserFormValues = z.infer<typeof userSchema>;
type AccesoFormValues = z.infer<typeof accesoInlineSchema>;

interface UsuarioFormProps {
  onSubmit?: (data: UsuarioCreateRequest) => Promise<void>;
  isLoading?: boolean;
  onSuccess?: () => void;
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
const errorClass = 'mt-1 text-xs text-red-400';

interface RolOption {
  idRol: number;
  nombreRol: string;
  estado: string;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'user' | 'acceso' | 'done'>('user');
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingAcceso, setIsCreatingAcceso] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RolOption[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await axiosInstance.get<RolOption[]>(API_ENDPOINTS.ROLES.ALL);
        setRoles(data.filter((r) => r.estado === 'ACTIVO'));
      } catch {
        // fallback
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const userForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const accesoForm = useForm<AccesoFormValues>({
    resolver: zodResolver(accesoInlineSchema),
  });

  const handleCreateUser = async (values: UserFormValues) => {
    setIsCreatingUser(true);
    setError(null);
    try {
      const { data } = await axiosInstance.post<{ idUsuario: number }>(
        API_ENDPOINTS.USUARIOS.BASE,
        values
      );
      setCreatedUserId(data.idUsuario);
      setStep('acceso');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el usuario.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateAcceso = async (values: AccesoFormValues) => {
    if (!createdUserId) return;
    setIsCreatingAcceso(true);
    setError(null);
    try {
      await accesoService.create({
        idUsuario: createdUserId,
        username: values.username,
        correoAcceso: values.correoAcceso,
      });
      setStep('done');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear las credenciales.');
    } finally {
      setIsCreatingAcceso(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-300">Usuario creado exitosamente</p>
          <p className="text-xs text-gray-400 mt-1">El usuario ya puede iniciar sesión con sus credenciales.</p>
        </div>
        <button onClick={onSuccess} className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Aceptar
        </button>
      </div>
    );
  }

  if (step === 'acceso') {
    return (
      <div>
        <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
          Usuario creado con ID #{createdUserId}. Ahora asigna sus credenciales de acceso.
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={accesoForm.handleSubmit(handleCreateAcceso)} className="space-y-4">
          <div>
            <label className={labelClass}>Username</label>
            <input {...accesoForm.register('username')} className={inputClass} placeholder="jperez" />
            {accesoForm.formState.errors.username && <p className={errorClass}>{accesoForm.formState.errors.username.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Correo de Acceso</label>
            <input {...accesoForm.register('correoAcceso')} className={inputClass} placeholder="jperez@email.com" />
            {accesoForm.formState.errors.correoAcceso && <p className={errorClass}>{accesoForm.formState.errors.correoAcceso.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onSuccess?.()}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
            >
              Omitir
            </button>
            <button
              type="submit"
              disabled={isCreatingAcceso}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isCreatingAcceso ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
              Crear Acceso
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={userForm.handleSubmit(handleCreateUser)} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Documento</label>
          <input {...userForm.register('documento')} className={inputClass} placeholder="1234567890" />
          {userForm.formState.errors.documento && <p className={errorClass}>{userForm.formState.errors.documento.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input {...userForm.register('telefono')} className={inputClass} placeholder="+57 300..." />
          {userForm.formState.errors.telefono && <p className={errorClass}>{userForm.formState.errors.telefono.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Nombres</label>
          <input {...userForm.register('nombres')} className={inputClass} placeholder="Juan Carlos" />
          {userForm.formState.errors.nombres && <p className={errorClass}>{userForm.formState.errors.nombres.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Apellidos</label>
          <input {...userForm.register('apellidos')} className={inputClass} placeholder="Pérez García" />
          {userForm.formState.errors.apellidos && <p className={errorClass}>{userForm.formState.errors.apellidos.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Género</label>
          <select {...userForm.register('genero')} className={inputClass}>
            <option value="">Seleccionar...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          {userForm.formState.errors.genero && <p className={errorClass}>{userForm.formState.errors.genero.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Fecha de Nacimiento</label>
          <input type="date" {...userForm.register('fechaNacimiento')} className={inputClass} />
          {userForm.formState.errors.fechaNacimiento && <p className={errorClass}>{userForm.formState.errors.fechaNacimiento.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Rol</label>
          {rolesLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-2.5">
              <Loader2 size={16} className="animate-spin" /> Cargando roles...
            </div>
          ) : (
            <select {...userForm.register('nombreRol')} className={inputClass}>
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.nombreRol}>
                  {rol.nombreRol}
                </option>
              ))}
            </select>
          )}
          {userForm.formState.errors.nombreRol && <p className={errorClass}>{userForm.formState.errors.nombreRol.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isCreatingUser}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isCreatingUser ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
          Crear Usuario
        </button>
      </div>
    </form>
  );
};
