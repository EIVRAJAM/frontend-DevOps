import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, KeyRound, Mail, Clock, AlertTriangle, Calendar, Hash } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { useAcceso } from '../hooks/useAcceso';
import { accesoService } from '../services/acceso.service';

export default function AccesoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { acceso, isLoading, error, fetchByIdUsuario } = useAcceso();

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchByIdUsuario(Number(id));
  }, [id]);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    setIsUpdating(true);
    setPasswordError(null);
    try {
      await accesoService.cambiarPasswordAdmin(Number(id), { passwordNueva: newPassword });
      setIsEditing(false);
      setNewPassword('');
    } catch {
      setPasswordError('No se pudo actualizar la contraseña.');
    } finally {
      setIsUpdating(false);
    }
  };

  const mapStatus = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return 'ACTIVO';
      case 'INACTIVA': return 'INACTIVO';
      case 'BLOQUEADA': return 'BLOQUEADO';
      default: return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 animate-pulse">
        Cargando acceso...
      </div>
    );
  }

  if (error || !acceso) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Acceso no encontrado.'}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-400 hover:underline">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Detalle de Acceso"
        subtitle={acceso.username}
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Volver
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield size={24} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{acceso.username}</h2>
              <p className="text-sm text-gray-400">{acceso.correoAcceso}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <DetailField label="ID Usuario" value={String(acceso.idUsuario)} />
            <DetailField label="Username" value={acceso.username} />
            <DetailField label="Correo de Acceso" value={acceso.correoAcceso} />
            {acceso.rol && <DetailField label="Rol" value={acceso.rol} />}
            <DetailField label="Último Login" value={acceso.ultimoLogin ? new Date(acceso.ultimoLogin).toLocaleString() : 'Nunca'} />
            <DetailField label="Fecha de Registro" value={new Date(acceso.creadoEn).toLocaleDateString()} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Estado</h3>
            <Badge status={mapStatus(acceso.estadoCuenta)} />
            <div className="pt-2 space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Intentos Fallidos</p>
                <span className={`text-lg font-bold ${acceso.intentosFallidos > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                  {acceso.intentosFallidos}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Última Actualización</p>
                <p className="text-sm text-gray-400">{new Date(acceso.actualizadoEn).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Contraseña</h3>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/60"
                    placeholder="Mínimo 8 caracteres"
                  />
                  {passwordError && <p className="text-xs text-red-400 mt-1.5">{passwordError}</p>}
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => { setIsEditing(false); setPasswordError(null); }}
                    className="text-xs font-medium text-gray-400 hover:text-white transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isUpdating}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                  >
                    {isUpdating ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 text-sm text-gray-300 transition-colors"
              >
                <KeyRound size={14} className="text-blue-400" /> Cambiar Contraseña
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);
