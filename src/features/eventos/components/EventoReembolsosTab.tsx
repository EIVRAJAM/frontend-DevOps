import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, RefreshCcw, ChevronDown, ChevronUp, CreditCard, User, Hash, Calendar, Mail, Phone, AlertTriangle, DollarSign } from 'lucide-react';
import { useReembolsosPorEvento, useRevisarSolicitud, useAprobarSolicitud, useRechazarSolicitud, useMarcarReembolsada } from '../../reembolsos/hooks/reembolso.queries';
import { ReembolsoStatusBadge } from '../../reembolsos/components/ReembolsoStatusBadge';
import { SolicitudReembolsoResponse } from '../../reembolsos/types/reembolso.types';
import { Modal } from '../../../components/ui/Modal';
import UsuarioCell from '../../../components/common/UsuarioCell';

interface EventoReembolsosTabProps {
  idEvento: number;
}

export const EventoReembolsosTab: React.FC<EventoReembolsosTabProps> = ({ idEvento }) => {
  const { data: reembolsos, isLoading, error } = useReembolsosPorEvento(idEvento);
  const { mutate: revisar } = useRevisarSolicitud();
  const { mutate: aprobar } = useAprobarSolicitud();
  const { mutate: rechazar } = useRechazarSolicitud();
  const { mutate: marcar } = useMarcarReembolsada();

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [actionDialog, setActionDialog] = useState<{ type: 'revisar' | 'aprobar' | 'rechazar' | 'marcar'; solicitudId: number } | null>(null);
  const [comentario, setComentario] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const executeAction = () => {
    if (!actionDialog) return;
    const { solicitudId, type } = actionDialog;
    const callbacks = {
      onSuccess: () => { setFeedback({ type: 'success', msg: 'Operación exitosa.' }); setActionDialog(null); },
      onError: (err: any) => { setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error.' }); },
    };
    if (type === 'revisar') revisar({ eventoId: idEvento, solicitudId }, callbacks);
    if (type === 'aprobar') {
      aprobar({ eventoId: idEvento, solicitudId, payload: { comentario: comentario || undefined } }, { ...callbacks, onSuccess: () => { callbacks.onSuccess(); setComentario(''); } });
    }
    if (type === 'rechazar') rechazar({ eventoId: idEvento, solicitudId, payload: { comentario } }, { ...callbacks, onSuccess: () => { callbacks.onSuccess(); setComentario(''); } });
    if (type === 'marcar') marcar({ eventoId: idEvento, solicitudId }, callbacks);
  };

  if (isLoading) return <div className="flex justify-center items-center h-40 text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (error) return <div className="text-center py-10 text-red-400">Error al cargar reembolsos.</div>;
  if (!reembolsos || reembolsos.length === 0) return <div className="text-center py-10 text-gray-400">No hay solicitudes de reembolso para este evento.</div>;

  return (
    <div className="space-y-3">
      {feedback && (
        <div className={`rounded-xl border px-4 py-2 text-sm ${feedback.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
          {feedback.msg}
        </div>
      )}

      {reembolsos.map((s) => {
        const isExpanded = expanded.has(s.idSolicitud);
        return (
          <div key={s.idSolicitud} className="rounded-xl border border-white/5 bg-gray-900/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-mono text-gray-400">#{s.idSolicitud}</span>
                  <ReembolsoStatusBadge estado={s.estado} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs mb-2">
                  <div>
                    <span className="text-gray-500">Usuario</span>
                    <UsuarioCell userId={s.idUsuarioSolicitante} />
                  </div>
                  <div>
                    <span className="text-gray-500">Ticket</span>
                    <p className="text-gray-300 font-mono">#{s.idTicket}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Motivo</span>
                    <p className="text-gray-300 line-clamp-1">{s.motivo}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Monto solicitado</span>
                    <p className="text-gray-300">${s.montoSolicitado?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha solicitud</span>
                    <p className="text-gray-300">{new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</p>
                  </div>
                  {s.montoAprobado != null && (
                    <div>
                      <span className="text-gray-500">Monto aprobado</span>
                      <p className="text-emerald-400">${s.montoAprobado.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {s.respuestaOrganizador && (
                  <div className="mb-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-xs text-blue-300">
                    Respuesta: {s.respuestaOrganizador}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {s.estado === 'SOLICITADA' && (
                  <button onClick={() => setActionDialog({ type: 'revisar', solicitudId: s.idSolicitud })} className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md hover:bg-blue-500/20 transition-colors">
                    <RefreshCcw size={12} /> Revisar
                  </button>
                )}
                {(s.estado === 'SOLICITADA' || s.estado === 'EN_REVISION') && (
                  <>
                    <button onClick={() => setActionDialog({ type: 'aprobar', solicitudId: s.idSolicitud })} className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md hover:bg-emerald-500/20 transition-colors">
                      <CheckCircle size={12} /> Aprobar
                    </button>
                    <button onClick={() => setActionDialog({ type: 'rechazar', solicitudId: s.idSolicitud })} className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md hover:bg-red-500/20 transition-colors">
                      <XCircle size={12} /> Rechazar
                    </button>
                  </>
                )}
                {s.estado === 'APROBADA' && (
                  <button onClick={() => setActionDialog({ type: 'marcar', solicitudId: s.idSolicitud })} className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-md hover:bg-green-500/20 transition-colors">
                    <DollarSign size={12} /> Marcar Reembolsado
                  </button>
                )}
              </div>
            </div>

            {s.datosReembolso && (
              <>
                <button
                  onClick={() => toggleExpand(s.idSolicitud)}
                  className="flex items-center gap-2 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Datos para el reembolso
                </button>

                {isExpanded && (
                  <div className="mt-3 rounded-xl border border-white/5 bg-gray-950/60 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">DATOS PARA EL REEMBOLSO</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Field icon={<CreditCard size={14} />} label="Medio de pago" value={s.datosReembolso.medioReembolso} />
                      <Field icon={<User size={14} />} label="Titular" value={s.datosReembolso.titularCuenta} />
                      <Field icon={<Hash size={14} />} label="Documento del titular" value={s.datosReembolso.documentoTitular} />
                      {s.datosReembolso.tipoCuenta && <Field icon={<CreditCard size={14} />} label="Tipo de cuenta" value={s.datosReembolso.tipoCuenta} />}
                      {s.datosReembolso.numeroCuentaEnmascarado && <Field icon={<Hash size={14} />} label="Cuenta enmascarada" value={s.datosReembolso.numeroCuentaEnmascarado} />}
                      <Field icon={<Mail size={14} />} label="Correo de contacto" value={s.datosReembolso.correoContacto} />
                      <Field icon={<Phone size={14} />} label="Teléfono" value={s.datosReembolso.telefonoContacto} />
                      {s.datosReembolso.observaciones && <Field icon={<Calendar size={14} />} label="Observaciones" value={s.datosReembolso.observaciones} />}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      <Modal isOpen={actionDialog !== null && actionDialog.type === 'revisar'} onClose={() => setActionDialog(null)} title="Revisar Solicitud" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">¿Marcar esta solicitud como en revisión?</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setActionDialog(null)} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Cancelar</button>
            <button onClick={executeAction} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">Confirmar</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={actionDialog !== null && actionDialog.type === 'marcar'} onClose={() => setActionDialog(null)} title="Marcar Reembolsado" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">¿Confirmas que el reembolso ya fue realizado externamente? Esto marcará la solicitud como completada.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setActionDialog(null)} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Cancelar</button>
            <button onClick={executeAction} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">Confirmar</button>
          </div>
        </div>
      </Modal>

      {actionDialog?.type === 'aprobar' && (() => {
        const s = reembolsos.find(r => r.idSolicitud === actionDialog.solicitudId);
        if (!s) return null;
        return (
          <Modal isOpen onClose={() => { setActionDialog(null); setComentario(''); }} title="Aprobar Reembolso" size="md">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Solicitud #{s.idSolicitud}</p>
                  <p className="text-xs text-gray-500">Ticket #{s.idTicket} · </p>
                  <UsuarioCell userId={s.idUsuarioSolicitante} />
                </div>
              </div>

              <div className="rounded-xl bg-gray-950/50 border border-white/5 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Monto solicitado</span>
                  <span className="text-gray-300">${s.montoSolicitado?.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/5 pt-2">
                  <span className="text-xs text-gray-500">Motivo</span>
                  <p className="text-gray-300 mt-1">{s.motivo}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-300 space-y-1">
                  <p className="font-medium">Al aprobar esta solicitud, confirmas que el reembolso procede por el 100% del monto pagado.</p>
                  <p>La plataforma no devuelve el dinero automáticamente. El reembolso debe tramitarse externamente y luego marcarse como reembolsado en el sistema.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Comentario (opcional)</label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/60" rows={2} placeholder="Ej. Aprobado. Procede el reembolso." />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setActionDialog(null); setComentario(''); }} className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  Cancelar
                </button>
                <button onClick={executeAction} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
                  Confirmar Aprobación
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}

      {actionDialog?.type === 'rechazar' && (() => {
        const s = reembolsos.find(r => r.idSolicitud === actionDialog.solicitudId);
        if (!s) return null;
        return (
          <Modal isOpen onClose={() => { setActionDialog(null); setComentario(''); }} title="Rechazar Reembolso" size="md">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <XCircle size={20} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Solicitud #{s.idSolicitud}</p>
                  <p className="text-xs text-gray-500">Ticket #{s.idTicket} · </p>
                  <UsuarioCell userId={s.idUsuarioSolicitante} />
                </div>
              </div>

              <div className="rounded-xl bg-gray-950/50 border border-white/5 p-4 text-sm">
                <span className="text-xs text-gray-500">Motivo</span>
                <p className="text-gray-300 mt-1">{s.motivo}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Motivo del rechazo</label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500/60" rows={3} placeholder="Explica el motivo del rechazo..." />
                {comentario.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">Requerido para confirmar el rechazo.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => { setActionDialog(null); setComentario(''); }} className="rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                  Cancelar
                </button>
                <button onClick={executeAction} disabled={comentario.length === 0} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors">
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};

const Field = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-gray-500">{icon}</span>
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm text-gray-200">{value}</p>
  </div>
);
