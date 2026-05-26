import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { AccesoAdminResponse } from '../types/acceso.types';
import { KeyRound, X, Save, Shield, User, Mail, Clock, AlertTriangle } from 'lucide-react';
import { accesoService } from '../services/acceso.service';

interface AccesoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  acceso: AccesoAdminResponse | null;
}

export const AccesoDetailModal: React.FC<AccesoDetailModalProps> = ({ isOpen, onClose, acceso }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!acceso) return null;

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }

    setIsUpdating(true);
    setError(null);
    try {
      await accesoService.cambiarPasswordAdmin(acceso.idUsuario, { passwordNueva: newPassword });
      setIsEditing(false);
      setNewPassword('');
      setSuccess(true);
    } catch (err: any) {
      setError('No se pudo actualizar la contraseña.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setNewPassword('');
    setError(null);
    onClose();
  };

  const mapStatus = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return 'ACTIVO';
      case 'INACTIVA': return 'INACTIVO';
      case 'BLOQUEADA': return 'BLOQUEADO';
      default: return estado;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Detalles de Acceso" size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield size={22} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{acceso.username}</h2>
            <p className="text-sm text-gray-400">ID Usuario: {acceso.idUsuario}</p>
          </div>
          <Badge status={mapStatus(acceso.estadoCuenta)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DetailField
            label="Correo"
            value={acceso.correoAcceso}
            icon={<Mail size={14} className="text-gray-500" />}
          />
          <DetailField
            label="Intentos Fallidos"
            value={String(acceso.intentosFallidos)}
            icon={<AlertTriangle size={14} className={acceso.intentosFallidos > 0 ? 'text-red-400' : 'text-gray-500'} />}
          />
          <DetailField
            label="Último Login"
            value={acceso.ultimoLogin ? new Date(acceso.ultimoLogin).toLocaleString() : 'Nunca'}
            icon={<Clock size={14} className="text-gray-500" />}
          />
          <DetailField
            label="Registrado"
            value={new Date(acceso.creadoEn).toLocaleDateString()}
            icon={<User size={14} className="text-gray-500" />}
          />
        </div>

        <div className="border-t border-white/5 pt-4">
          {isEditing ? (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                  <KeyRound size={16} /> Modificar Contraseña
                </h3>
                <p className="text-xs text-gray-400 mt-1">Establece una nueva contraseña para este usuario.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/60"
                  placeholder="Mínimo 8 caracteres"
                />
                {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-medium text-gray-400 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdatePassword}
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {isUpdating ? 'Guardando...' : <><Save size={14} /> Guardar</>}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {success && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                  Contraseña actualizada con éxito
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 text-sm text-gray-300 transition-colors"
                >
                  <KeyRound size={14} className="text-blue-400" /> Cambiar Contraseña
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const DetailField = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-center gap-1.5">
      {icon}
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  </div>
);
