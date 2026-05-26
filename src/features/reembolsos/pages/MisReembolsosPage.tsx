import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMisSolicitudes, useCancelarSolicitud } from '../hooks/reembolso.queries';
import { SolicitudReembolsoResponse } from '../types/reembolso.types';
import { reembolsoEstadoIcon, reembolsoEstadoStyle } from '../utils/reembolsoHelpers';
import { Loader2, Ban, AlertTriangle, RefreshCcw, CalendarDays, ChevronDown, ChevronUp, CreditCard, User, Hash, Mail, Phone } from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Modal } from '../../../components/ui/Modal';

export default function MisReembolsosPage() {
  const { user } = useAuthStore();
  const { data: solicitudes, isLoading, error } = useMisSolicitudes();
  const { mutate: cancelar, isPending: isCancelling } = useCancelarSolicitud();

  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCancelar = (id: number) => {
    setConfirmCancel(null);
    cancelar(id, {
      onSuccess: () => setFeedback({ type: 'success', msg: `Solicitud #${id} cancelada.` }),
      onError: (err: any) => setFeedback({ type: 'error', msg: err.response?.data?.message || 'Error al cancelar la solicitud.' }),
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Mis Solicitudes de Reembolso"
        subtitle={`Bienvenido, ${user?.username}. Gestiona tus solicitudes de reembolso.`}
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
          <RefreshCcw className="mx-auto text-gray-700 mb-4" size={48} />
          <p className="text-gray-400 text-lg">Aún no tienes solicitudes de reembolso.</p>
          <Link to="/dashboard/mis-tickets" className="inline-flex items-center gap-2 mt-4 text-indigo-400 hover:text-indigo-300 text-sm">
            <CalendarDays size={16} /> Ir a Mis Tickets
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => {
            const isExpanded = expanded.has(s.idSolicitud);
            return (
              <div key={s.idSolicitud} className="rounded-2xl border border-white/5 bg-gray-900/30 p-5 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-400">#{s.idSolicitud}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${reembolsoEstadoStyle(s.estado)}`}>
                        {reembolsoEstadoIcon(s.estado)} {s.estado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs">
                      <div>
                        <span className="text-gray-500">Ticket</span>
                        <p className="text-gray-300 font-mono">#{s.idTicket}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Evento</span>
                        <p className="text-gray-300">#{s.idEvento}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Motivo</span>
                        <p className="text-gray-300 line-clamp-1">{s.motivo}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Monto solicitado</span>
                        <p className="text-gray-300">${s.montoSolicitado?.toLocaleString()}</p>
                      </div>
                      {s.montoAprobado != null && (
                        <div>
                          <span className="text-gray-500">Monto aprobado</span>
                          <p className="text-emerald-400">${s.montoAprobado.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Fecha</span>
                        <p className="text-gray-300">{new Date(s.fechaSolicitud).toLocaleDateString('es-CO')}</p>
                      </div>
                    </div>

                    {s.respuestaOrganizador && (
                      <div className="mt-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-xs text-blue-300">
                        Respuesta: {s.respuestaOrganizador}
                      </div>
                    )}
                  </div>

                  {(s.estado === 'SOLICITADA' || s.estado === 'EN_REVISION') && (
                    <button
                      onClick={() => setConfirmCancel(s.idSolicitud)}
                      disabled={isCancelling}
                      className="flex items-center gap-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 shrink-0"
                    >
                      <Ban size={12} /> Cancelar
                    </button>
                  )}
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
                          <Field icon={<Hash size={14} />} label="Documento" value={s.datosReembolso.documentoTitular} />
                          {s.datosReembolso.tipoCuenta && <Field icon={<CreditCard size={14} />} label="Tipo de cuenta" value={s.datosReembolso.tipoCuenta} />}
                          {s.datosReembolso.numeroCuentaEnmascarado && <Field icon={<Hash size={14} />} label="Cuenta enmascarada" value={s.datosReembolso.numeroCuentaEnmascarado} />}
                          <Field icon={<Mail size={14} />} label="Correo" value={s.datosReembolso.correoContacto} />
                          <Field icon={<Phone size={14} />} label="Teléfono" value={s.datosReembolso.telefonoContacto} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={confirmCancel !== null} onClose={() => setConfirmCancel(null)} title="Cancelar Solicitud" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">¿Estás seguro de cancelar esta solicitud de reembolso?</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setConfirmCancel(null)} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
              Mantener
            </button>
            <button onClick={() => confirmCancel && handleCancelar(confirmCancel)} disabled={isCancelling} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50">
              {isCancelling ? 'Cancelando...' : 'Sí, Cancelar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const Field = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-gray-500">{icon}</span>
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm text-gray-200">{value}</p>
  </div>
);
