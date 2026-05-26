import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { DataViewer } from '../../../components/ui/DataViewer';
import { FuncionalidadResponse } from '../types/funcionalidad.types';
import { FuncionalidadForm } from './FuncionalidadForm';
import { Pencil, X } from 'lucide-react';
import { funcionalidadService } from '../services/funcionalidad.service';

interface FuncionalidadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionalidad: FuncionalidadResponse | null;
  onUpdateSuccess: () => void;
}

export const FuncionalidadDetailModal: React.FC<FuncionalidadDetailModalProps> = ({ isOpen, onClose, funcionalidad, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!funcionalidad) return null;

  const handleUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      await funcionalidadService.update(funcionalidad.idFuncionalidad, data);
      setIsEditing(false);
      onUpdateSuccess();
    } catch (err: any) {
      setError('Error al actualizar la funcionalidad');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Detalles de Funcionalidad" size="md">
      <div className="space-y-4">
        {isEditing ? (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
                <Pencil size={16} /> Editando Funcionalidad
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X size={16}/></button>
            </div>
            
            <FuncionalidadForm 
              initialData={funcionalidad} 
              onSubmit={handleUpdate} 
              isLoading={isUpdating} 
            />
          </div>
        ) : (
          <div className="flex justify-end">
             <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 text-sm text-gray-300 transition-colors"
              >
                <Pencil size={14} className="text-indigo-400" /> Editar Info
              </button>
          </div>
        )}

        <div className="pt-2">
          <DataViewer data={funcionalidad} />
        </div>
      </div>
    </Modal>
  );
};
