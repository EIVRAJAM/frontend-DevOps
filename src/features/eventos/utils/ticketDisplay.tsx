import { CheckCircle, CreditCard, Clock, Ban, XCircle } from 'lucide-react';
import { TicketResponseDTO } from '../types/ticket.types';

export const ticketEstadoIcon = (estado: TicketResponseDTO['estadoTicket']) => {
  switch (estado) {
    case 'GRATIS':      return <CheckCircle size={14} />;
    case 'PAGADO':      return <CreditCard size={14} />;
    case 'PENDIENTE':   return <Clock size={14} />;
    case 'CANCELADO':   return <Ban size={14} />;
    case 'REEMBOLSADO': return <XCircle size={14} />;
    default: return null;
  }
};

export const ticketEstadoStyle = (estado: TicketResponseDTO['estadoTicket']) => {
  switch (estado) {
    case 'GRATIS':      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'PAGADO':      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'PENDIENTE':   return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'CANCELADO':   return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'REEMBOLSADO': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    default:            return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};
