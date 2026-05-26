import React, { useEffect, useState } from 'react';
import { User, Shield, Clock, Calendar, KeyRound, Mail, Phone, Hash, Pencil, X, Save, Loader2 } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { ChangePasswordForm } from '../../auth/components/ChangePasswordForm';
import { usuarioService } from '../../usuarios/services/usuario.service';
import { sesionService } from '../../sesiones/services/sesion.service';
import { UsuarioResponse } from '../../usuarios/types/usuario.types';
import { SesionResponseDto } from '../../sesiones/types/sesion.types';

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';

type ActiveView = 'view' | 'edit' | 'password';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UsuarioResponse | null>(null);
  const [lastSession, setLastSession] = useState<SesionResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('view');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formDoc, setFormDoc] = useState('');
  const [formNombres, setFormNombres] = useState('');
  const [formApellidos, setFormApellidos] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formGenero, setFormGenero] = useState('');
  const [formFechaNac, setFormFechaNac] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const [userData, sessionData] = await Promise.all([
        usuarioService.getCurrentUser(),
        sesionService.getUltima().catch(() => null),
      ]);
      setProfile(userData);
      setLastSession(sessionData);
    } catch {
      setError('No se pudo cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const startEditing = () => {
    if (!profile) return;
    setFormDoc(profile.documento || '');
    setFormNombres(profile.nombres || '');
    setFormApellidos(profile.apellidos || '');
    setFormTelefono(profile.telefono || '');
    setFormGenero(profile.genero || '');
    setFormFechaNac(profile.fechaNacimiento || '');
    setSaveError(null);
    setActiveView('edit');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await usuarioService.updateSelf({
        documento: formDoc || undefined,
        nombres: formNombres || undefined,
        apellidos: formApellidos || undefined,
        telefono: formTelefono || undefined,
        genero: (formGenero as 'masculino' | 'femenino') || undefined,
        fechaNacimiento: formFechaNac || undefined,
      });
      setActiveView('view');
      await fetchProfile();
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Error al actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Perfil no encontrado.'}</p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Mi Perfil"
        subtitle={`${profile.nombres} ${profile.apellidos}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <User size={28} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {profile.nombres} {profile.apellidos}
                </h2>
                <p className="text-sm text-gray-400">ID: {profile.idUsuario}</p>
              </div>
              {activeView !== 'view' && (
                <button onClick={() => setActiveView('view')} className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20">
                  <X size={16} /> Cancelar
                </button>
              )}
            </div>

            {activeView === 'edit' && (
              <form onSubmit={handleSave} className="space-y-4">
                {saveError && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{saveError}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Documento</label>
                    <input value={formDoc} onChange={(e) => setFormDoc(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Teléfono</label>
                    <input value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nombres</label>
                    <input value={formNombres} onChange={(e) => setFormNombres(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Apellidos</label>
                    <input value={formApellidos} onChange={(e) => setFormApellidos(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Género</label>
                    <select value={formGenero} onChange={(e) => setFormGenero(e.target.value)} className={inputClass}>
                      <option value="">Seleccionar...</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Fecha de Nacimiento</label>
                    <input type="date" value={formFechaNac} onChange={(e) => setFormFechaNac(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={isSaving} className="w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}

            {activeView === 'password' && (
              <div>
                <ChangePasswordForm />
              </div>
            )}

            {activeView === 'view' && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <DetailField icon={<Hash size={14} />} label="ID Usuario" value={String(profile.idUsuario)} />
                <DetailField icon={<Hash size={14} />} label="Documento" value={profile.documento} />
                {profile.telefono && <DetailField icon={<Phone size={14} />} label="Teléfono" value={profile.telefono} />}
                {profile.genero && <DetailField icon={<User size={14} />} label="Género" value={profile.genero} />}
                {profile.fechaNacimiento && <DetailField icon={<Calendar size={14} />} label="Fecha de Nacimiento" value={profile.fechaNacimiento} />}
                <DetailField icon={<Shield size={14} />} label="Estado" value={profile.estado || 'ACTIVO'} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Estado</h3>
            </div>
            <span className={`inline-block rounded-lg px-3 py-1 text-sm font-medium ${profile.estado === 'ACTIVO' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-gray-500/10 border border-gray-500/20 text-gray-400'}`}>
              {profile.estado || 'ACTIVO'}
            </span>
          </div>

          {lastSession && (
            <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Última Sesión</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">{new Date(lastSession.fechaInicio).toLocaleString('es-CO')}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${lastSession.activa ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {lastSession.activa ? 'Activa' : 'Cerrada'}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Acciones</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={startEditing}
                disabled={activeView !== 'view'}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors text-left flex items-center gap-2 disabled:opacity-30"
              >
                <Pencil size={14} className="text-indigo-400" />
                Editar Perfil
              </button>
              <button
                onClick={() => setActiveView('password')}
                disabled={activeView !== 'view'}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors text-left flex items-center gap-2 disabled:opacity-30"
              >
                <KeyRound size={14} className="text-blue-400" />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-gray-500">{icon}</span>
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);
