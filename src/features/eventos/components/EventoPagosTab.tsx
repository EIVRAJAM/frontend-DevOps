import React from 'react';
import { Loader2, CheckCircle, XCircle, Clock, Receipt } from 'lucide-react';
import { usePagosPorEvento } from '../hooks/pago.queries';
import { PagoResponse } from '../types/evento.types';
import UsuarioCell from '../../../components/common/UsuarioCell';

interface EventoPagosTabProps {
  idEvento: number;
}

const estadoStyle = (estado: string) => {
  switch (estado) {
    case 'EXITOSO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    case 'FALLIDO': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'PENDIENTE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

const estadoIcon = (estado: string) => {
  switch (estado) {
    case 'EXITOSO': return <CheckCircle size={14} />;
    case 'FALLIDO': return <XCircle size={14} />;
    case 'PENDIENTE': return <Clock size={14} />;
    default: return null;
  }
};

export const EventoPagosTab: React.FC<EventoPagosTabProps> = ({ idEvento }) => {
  const { data: pagos, isLoading, error } = usePagosPorEvento(idEvento);

  if (isLoading) return <div className="flex justify-center items-center h-40 text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (error) return <div className="text-center py-10 text-red-400">Error al cargar pagos.</div>;
  if (!pagos || pagos.length === 0) return <div className="text-center py-10 text-gray-400">No hay pagos registrados para este evento.</div>;

  return (
    <div className="space-y-3">
      {pagos.map((pago) => (
        <div key={pago.idPago} className="rounded-xl border border-white/5 bg-gray-900/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-400">#{pago.idPago}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${estadoStyle(pago.estadoPago)}`}>
                  {estadoIcon(pago.estadoPago)} {pago.estadoPago}
                </span>
                <span className="text-xs text-gray-500">{pago.tipoPago}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-500">Monto</span>
                  <p className="text-gray-300">${pago.monto?.toLocaleString()} {pago.moneda}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ticket</span>
                  <p className="text-gray-300">#{pago.idTicket}</p>
                </div>
                <div>
                  <span className="text-gray-500">Usuario</span>
                  <UsuarioCell userId={pago.usuarioId} />
                </div>
                <div>
                  <span className="text-gray-500">Fecha</span>
                  <p className="text-gray-300">{new Date(pago.creadoEn).toLocaleDateString('es-CO')}</p>
                </div>
              </div>

              {pago.stripeChargeId && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Receipt size={12} />
                  <span className="font-mono">{pago.stripeChargeId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
