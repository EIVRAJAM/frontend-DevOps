import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMisTickets, useCancelarTicket, useMisEventosCancelados } from '../hooks/ticket.queries';
import { ticketService } from '../services/ticket.service';
import { TicketResponseDTO } from '../types/ticket.types';
import { ticketEstadoIcon, ticketEstadoStyle } from '../utils/ticketDisplay';
import {
  Loader2, Ticket, XCircle, CreditCard, CheckCircle,
  Ban, CalendarDays, QrCode, X, Download, AlertTriangle, RefreshCcw,
} from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Modal } from '../../../components/ui/Modal';
import { SolicitarReembolsoDialog } from '../../reembolsos/components/SolicitarReembolsoDialog';

interface QrModalProps {
  ticket: TicketResponseDTO;
  onClose: () => void;
}

const QrModal: React.FC<QrModalProps> = ({ ticket, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let objectUrl: string;
    const fetchQr = async () => {
      try {
        objectUrl = await ticketService.getQrImageUrl(ticket.idTicket);
        setQrUrl(objectUrl);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No se pudo cargar el código QR.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQr();
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ticket.idTicket]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `ticket-${ticket.idTicket}-qr.png`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Código QR del Ticket</h2>
            <p className="text-sm text-gray-400 truncate max-w-[200px]">{ticket.nombreEvento}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Image */}
        <div className="flex justify-center mb-6">
          {isLoading ? (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-800 rounded-2xl border border-white/5">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
            </div>
          ) : error ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-2xl gap-3 p-4 text-center">
              <XCircle className="text-red-400" size={40} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-2xl shadow-lg shadow-indigo-500/20">
              <img
                src={qrUrl!}
                alt={`QR Ticket #${ticket.idTicket}`}
                className="w-56 h-56 object-contain"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center space-y-1 mb-6">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Ticket</p>
          <p className="text-white font-mono text-lg font-bold">#{ticket.idTicket}</p>
          <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium ${ticketEstadoStyle(ticket.estadoTicket)}`}>
            {ticketEstadoIcon(ticket.estadoTicket)} {ticket.estadoTicket}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={!qrUrl}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            <Download size={16} /> Descargar PNG
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
          >
            <X size={16} /> Cerrar
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Muestra este QR en la entrada del evento
        </p>
      </div>
    </div>
  );
};

export default function MisTicketsPage() {
  const { user } = useAuthStore();

  const { data: tickets, isLoading, error } = useMisTickets();
  const { data: cancelados } = useMisEventosCancelados();
  const { mutate: cancelar, isPending: isCancelling } = useCancelarTicket();

  const [cancelling, setCancelling] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [qrTicket, setQrTicket] = useState<TicketResponseDTO | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);
  const [refundTicket, setRefundTicket] = useState<TicketResponseDTO | null>(null);

  const handleCancelar = (id: number) => {
    setConfirmCancel(null);
    setCancelling(id);
    setFeedback(null);
    cancelar(id, {
      onSuccess: () => {
        setFeedback({ type: 'success', msg: `Ticket #${id} cancelado. El cupo ha sido devuelto al evento.` });
        setCancelling(null);
      },
      onError: (err: any) => {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Error al cancelar el ticket.';
        setFeedback({ type: 'error', msg });
        setCancelling(null);
      },
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-6xl mx-auto">
      {/* ── HEADER ── */}
      <PageHeader
        title="Mis Tickets"
        subtitle={`Bienvenido, ${user?.username}. Gestiona tus inscripciones.`}
        action={
          <Link
            to="/dashboard/mis-reembolsos"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
          >
            Mis Reembolsos
          </Link>
        }
      />

      <div className="max-w-6xl mx-auto mt-4">

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`mb-6 px-5 py-4 rounded-xl border font-medium text-sm animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? '✅' : '❌'} {feedback.msg}
          </div>
        )}

        {cancelados && cancelados.tickets && cancelados.tickets.length > 0 && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-300">
                {cancelados.total} evento{cancelados.total !== 1 ? 's' : ''} cancelado{cancelados.total !== 1 ? 's' : ''}
              </h3>
            </div>
            <div className="space-y-2">
              {cancelados.tickets.map((ct) => (
                <div key={ct.idTicket} className="flex items-center justify-between rounded-xl bg-gray-900/40 border border-white/5 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200 truncate">{ct.evento.nombreEvento}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ct.evento.fechaEvento}
                    </p>
                    {ct.mensaje && (
                      <span className={`inline-block mt-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${ct.reembolsoDisponible ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'}`}>
                        {ct.mensaje}
                      </span>
                    )}
                  </div>
                  {ct.reembolsoDisponible && (
                    <button
                      onClick={() => {
                        const match = tickets?.find((t) => t.idTicket === ct.idTicket);
                        setRefundTicket(match || {
                          idTicket: ct.idTicket,
                          nombreEvento: ct.evento.nombreEvento,
                          montoPagado: 0,
                          moneda: 'COP',
                        } as TicketResponseDTO);
                      }}
                      className="ml-3 shrink-0 flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors"
                    >
                      <RefreshCcw size={12} /> Solicitar Reembolso
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Cargando tus tickets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl">
            Error al cargar los tickets. Intenta de nuevo más tarde.
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <Ticket className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Aún no tienes tickets.</p>
            <p className="text-gray-600 text-sm mt-1">¡Inscríbete a un evento para comenzar!</p>
            <Link
              to="/dashboard/portal"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <CalendarDays size={16} />
              Explorar eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.idTicket}
                className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/10 transition-all"
              >
                {/* Ticket info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-white font-semibold">{ticket.nombreEvento}</span>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${ticketEstadoStyle(ticket.estadoTicket)}`}>
                      {ticketEstadoIcon(ticket.estadoTicket)}
                      {ticket.estadoTicket}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                    <span>Ticket <span className="text-gray-400 font-mono">#{ticket.idTicket}</span></span>
                    <span>Evento <span className="text-gray-400 font-mono">#{ticket.idEvento}</span></span>
                    {ticket.montoPagado > 0 && (
                      <span className="text-emerald-400 font-medium">Pagado: {ticket.montoPagado} {ticket.moneda}</span>
                    )}
                    {ticket.checkinRealizado && (
                      <span className="text-blue-400 flex items-center gap-1">
                        <CheckCircle size={12} /> Ingresó {ticket.fechaCheckin ? new Date(ticket.fechaCheckin).toLocaleDateString('es-CO') : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">
                    Inscrito el{' '}
                    {new Date(ticket.creadoEn).toLocaleDateString('es-CO', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Ver QR — only for active tickets */}
                  {(ticket.estadoTicket === 'GRATIS' || ticket.estadoTicket === 'PAGADO') && (
                    <button
                      onClick={() => setQrTicket(ticket)}
                      className="flex items-center gap-2 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-2 rounded-xl hover:bg-indigo-500/20 transition-all"
                    >
                      <QrCode size={14} />
                      Ver QR
                    </button>
                  )}

                  {/* Cancel — only for active tickets */}
                  {(ticket.estadoTicket === 'GRATIS' || ticket.estadoTicket === 'PAGADO') && (
                    <button
                      onClick={() => setConfirmCancel(ticket.idTicket)}
                      disabled={isCancelling && cancelling === ticket.idTicket}
                      className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling && cancelling === ticket.idTicket ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <XCircle size={12} />
                      )}
                      Cancelar
                    </button>
                  )}

                  {ticket.estadoTicket === 'PAGADO' && (
                    <button
                      onClick={() => setRefundTicket(ticket)}
                      className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-2 rounded-xl hover:bg-amber-500/20 transition-all"
                    >
                      <RefreshCcw size={12} />
                      Reembolso
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrTicket && (
        <QrModal ticket={qrTicket} onClose={() => setQrTicket(null)} />
      )}

      <Modal isOpen={confirmCancel !== null} onClose={() => setConfirmCancel(null)} title="Cancelar Ticket" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">
              ¿Estás seguro de que deseas cancelar este ticket? El cupo será devuelto al evento.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmCancel(null)}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              Mantener Ticket
            </button>
            <button
              onClick={() => confirmCancel && handleCancelar(confirmCancel)}
              disabled={isCancelling}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {isCancelling ? 'Cancelando...' : 'Sí, Cancelar'}
            </button>
          </div>
        </div>
      </Modal>

      <SolicitarReembolsoDialog
        isOpen={refundTicket !== null}
        onClose={() => setRefundTicket(null)}
        ticketId={refundTicket?.idTicket ?? 0}
        ticketNombre={refundTicket?.nombreEvento ?? ''}
        montoPagado={refundTicket?.montoPagado ?? 0}
        moneda={refundTicket?.moneda ?? 'COP'}
      />
    </div>
  );
}
