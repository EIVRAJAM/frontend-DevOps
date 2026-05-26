import React from 'react';
import { CheckCircle, XCircle, Lock } from 'lucide-react';

type EntityStatus = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO' | string;

interface StatusToggleProps {
  status: EntityStatus;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onBlock?: () => void;
  isLoading?: boolean;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  ACTIVO: ['DESACTIVAR', 'BLOQUEAR'],
  INACTIVO: ['ACTIVAR', 'BLOQUEAR'],
  BLOQUEADO: ['ACTIVAR'],
};

export const StatusToggle: React.FC<StatusToggleProps> = ({
  status,
  onActivate,
  onDeactivate,
  onBlock,
  isLoading = false,
}) => {
  const normalized = status?.toUpperCase() ?? '';
  const allowed = VALID_TRANSITIONS[normalized] ?? [];

  if (allowed.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {allowed.includes('ACTIVAR') && onActivate && (
        <button
          onClick={onActivate}
          disabled={isLoading}
          title="Activar"
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
        >
          <CheckCircle size={14} />
          Activar
        </button>
      )}
      {allowed.includes('DESACTIVAR') && onDeactivate && (
        <button
          onClick={onDeactivate}
          disabled={isLoading}
          title="Desactivar"
          className="flex items-center gap-1.5 rounded-lg border border-gray-500/30 bg-gray-500/10 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-gray-500/20 disabled:opacity-50"
        >
          <XCircle size={14} />
          Desactivar
        </button>
      )}
      {allowed.includes('BLOQUEAR') && onBlock && (
        <button
          onClick={onBlock}
          disabled={isLoading}
          title="Bloquear"
          className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
        >
          <Lock size={14} />
          Bloquear
        </button>
      )}
    </div>
  );
};
