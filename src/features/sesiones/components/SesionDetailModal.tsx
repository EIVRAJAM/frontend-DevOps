import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { DataViewer } from '../../../components/ui/DataViewer';
import { SesionResponseDto } from '../types/sesion.types';
import { ShieldAlert } from 'lucide-react';

interface SesionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sesion: SesionResponseDto | null;
  onDisconnect: (idSesion: number) => void;
  isAdmin: boolean;
}

export const SesionDetailModal: React.FC<SesionDetailModalProps> = ({ isOpen, onClose, sesion, onDisconnect, isAdmin }) => {
  if (!sesion) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles de Sesión" size="lg">
      <div className="space-y-4">
        {sesion.activa && isAdmin && (
          <div className="flex justify-end bg-red-500/5 border border-red-500/10 p-3 rounded-xl items-center gap-4">
            <p className="text-xs text-red-400">Esta sesión aún se encuentra activa y autorizada.</p>
            <button
              onClick={() => {
                onDisconnect(sesion.idSesion);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
            >
              <ShieldAlert size={16} /> Forzar Desconexión
            </button>
          </div>
        )}

        <DataViewer data={sesion} />
      </div>
    </Modal>
  );
};
