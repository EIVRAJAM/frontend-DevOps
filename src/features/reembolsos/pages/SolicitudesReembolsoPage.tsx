import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, XCircle, RefreshCcw, DollarSign } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Modal } from '../../../components/ui/Modal';
import { useReembolsosPorEvento, useRevisarSolicitud, useAprobarSolicitud, useRechazarSolicitud } from '../hooks/reembolso.queries';
import { ReembolsoStatusBadge } from '../components/ReembolsoStatusBadge';
import { SolicitudReembolsoResponse } from '../types/reembolso.types';

export default function SolicitudesReembolsoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventoId = Number(id);

  const { data: solicitudes, isLoading, error } = useReembolsosPorEvento(eventoId);
  const { mutate: revisar } = useRevisarSolicitud();
  const { mutate: aprobar } = useAprobarSolicitud();
  const { mutate: rechazar } = useRechazarSolicitud();

  const [actionDialog, setActionDialog] = useState<{ type: 'revisar' | 'aprobar' | 'rechazar'; solicitudId: number } | null>(null);
  const [comentario, setComentario] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const executeAction = () => {
    if (!actionDialog) return;
    const { solicitudId } = actionDialog;

    switch (actionDialog.type) {
      case 'revisar':
        revisar({ eventoId, solicitudId }, {
          onSuccess: () => { setFeedback({ type: 'success', msg: 'Solicitud marcada como en revisión.' }); setActionDialog(null); },
          onError: (err: any) => { setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error al revisar.' }); },
        });
        break;
      case 'aprobar':
        aprobar({ eventoId, solicitudId, payload: { comentario: comentario || undefined } }, {
          onSuccess: () => { setFeedback({ type: 'success', msg: 'Solicitud aprobada.' }); setActionDialog(null); setComentario(''); },
          onError: (err: any) => { setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error al aprobar.' }); },
        });
        break;
      case 'rechazar':
        rechazar({ eventoId, solicitudId, payload: { comentario } }, {
          onSuccess: () => { setFeedback({ type: 'success', msg: 'Solicitud rechazada.' }); setActionDialog(null); setComentario(''); },
          onError: (err: any) => { setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error al rechazar.' }); },
        });
        break;
    }
  };

  const renderActionButtons = (solicitud: SolicitudReembolsoResponse) => {
    const { estado, idSolicitud } = solicitud;
    return (
      <div className="flex items-center gap-2">
        {estado === 'SOLICITADA' && (
          <button onClick={() => setActionDialog({ type: 'revisar', solicitudId: idSolicitud })} className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md hover:bg-blue-500/20 transition-colors">
            <RefreshCcw size={12} /> Revisar
          </button>
        )}
        {(estado === 'SOLICITADA' || estado === 'EN_REVISION') && (
          <>
            <button onClick={() => setActionDialog({ type: 'aprobar', solicitudId: idSolicitud })} className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md hover:bg-emerald-500/20 transition-colors">
              <CheckCircle size={12} /> Aprobar
            </button>
            <button onClick={() => setActionDialog({ type: 'rechazar', solicitudId: idSolicitud })} className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md hover:bg-red-500/20 transition-colors">
              <XCircle size={12} /> Rechazar
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Solicitudes de Reembolso"
        subtitle={`Evento #${eventoId}`}
        action={
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10">
            <ArrowLeft size={16} /> Volver
          </button>
        }
      />

      {feedback && (
        <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
          {feedback.msg}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
          <p className="text-red-400">Error al cargar las solicitudes.</p>
        </div>
      ) : !solicitudes || solicitudes.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
          <p className="text-gray-400 text-lg">No hay solicitudes de reembolso para este evento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((solicitud) => (
            <div key={solicitud.idSolicitud} className="rounded-2xl border border-white/5 bg-gray-900/30 p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">Solicitud #{solicitud.idSolicitud}</p>
                  <p className="text-xs text-gray-500">Ticket #{solicitud.idTicket} · Usuario #{solicitud.idUsuarioSolicitante}</p>
                </div>
                <ReembolsoStatusBadge estado={solicitud.estado} />
              </div>

              <div className="mb-3 rounded-lg bg-gray-950/50 p-3 text-sm text-gray-300">
                {solicitud.motivo}
              </div>

              {solicitud.respuestaOrganizador && (
                <div className="mb-3 rounded-lg bg-gray-800/50 p-2 text-xs text-gray-400">
                  Respuesta: {solicitud.respuestaOrganizador}
                </div>
              )}

              {solicitud.montoAprobado != null && (
                <div className="mb-3 text-xs text-emerald-400">
                  Monto aprobado: ${solicitud.montoAprobado.toLocaleString()}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</span>
                {renderActionButtons(solicitud)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={actionDialog !== null} onClose={() => { setActionDialog(null); setComentario(''); }} title={
        actionDialog?.type === 'revisar' ? 'Revisar Solicitud' :
        actionDialog?.type === 'aprobar' ? 'Aprobar Solicitud' : 'Rechazar Solicitud'
      } size="sm">
        <div className="space-y-4">
          {(actionDialog?.type === 'aprobar' || actionDialog?.type === 'rechazar') && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {actionDialog.type === 'rechazar' ? 'Motivo del rechazo' : 'Comentario (opcional)'}
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/60"
                rows={3}
                placeholder={actionDialog.type === 'rechazar' ? 'Explica el motivo...' : 'Opcional...'}
              />
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button onClick={() => { setActionDialog(null); setComentario(''); }} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
              Cancelar
            </button>
            <button
              onClick={executeAction}
              disabled={actionDialog?.type === 'rechazar' && comentario.length === 0}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
