import { CheckCircle, XCircle, Clock, RefreshCcw, Ban } from 'lucide-react';
import { EstadoSolicitudReembolso } from '../types/reembolso.types';

export const reembolsoEstadoIcon = (estado: EstadoSolicitudReembolso) => {
  switch (estado) {
    case 'SOLICITADA': return <Clock size={14} />;
    case 'EN_REVISION': return <RefreshCcw size={14} />;
    case 'APROBADA': return <CheckCircle size={14} />;
    case 'PROCESADA': return <CheckCircle size={14} />;
    case 'REEMBOLSADA': return <CheckCircle size={14} />;
    case 'RECHAZADA': return <XCircle size={14} />;
    case 'CANCELADA': return <Ban size={14} />;
    case 'FALLIDA': return <XCircle size={14} />;
    default: return null;
  }
};

export const reembolsoEstadoStyle = (estado: EstadoSolicitudReembolso) => {
  switch (estado) {
    case 'SOLICITADA': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'EN_REVISION': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'APROBADA': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'PROCESADA': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'REEMBOLSADA': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'RECHAZADA': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'CANCELADA': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    case 'FALLIDA': return 'text-red-400 bg-red-500/10 border-red-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};
