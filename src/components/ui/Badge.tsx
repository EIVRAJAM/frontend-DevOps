import React from 'react';

type BadgeStatus =
  | 'ACTIVO'
  | 'INACTIVO'
  | 'BLOQUEADO'
  | 'PUBLICADO'
  | 'CANCELADO'
  | 'CERRADO'
  | 'BORRADOR'
  | string;

interface BadgeProps {
  status: BadgeStatus;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  INACTIVO: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  BLOQUEADO: 'bg-red-500/10 text-red-400 border-red-500/20',
  PUBLICADO: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  CANCELADO: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  CERRADO: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  BORRADOR: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const DEFAULT_STYLE = 'bg-gray-500/10 text-gray-400 border-gray-500/20';

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const style = STATUS_STYLES[status?.toUpperCase()] ?? DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide ${style} ${className}`}
    >
      {status}
    </span>
  );
};
