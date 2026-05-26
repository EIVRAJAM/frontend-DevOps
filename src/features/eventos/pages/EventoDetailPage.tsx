import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CalendarDays, MapPin, Pencil, X, Ticket,
  Loader2, CheckCircle, CreditCard, Clock, Ban, XCircle, Users, RefreshCcw, DollarSign, Bell,
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Badge } from '../../../components/ui/Badge';
import { usePermissions } from '../../../hooks/usePermissions';
import { useEvento } from '../hooks/useEvento';
import { EventoForm } from '../components/EventoForm';
import { EventoStaffTab } from '../components/EventoStaffTab';
import { EventoReembolsosTab } from '../components/EventoReembolsosTab';
import { EventoPagosTab } from '../components/EventoPagosTab';
import UsuarioCell from '../../../components/common/UsuarioCell';
import { eventoService } from '../services/evento.service';
import { TicketResponseDTO } from '../types/ticket.types';

type Tab = 'info' | 'historial' | 'tickets' | 'staff' | 'reembolsos' | 'pagos';

const ticketEstadoStyle = (estado: TicketResponseDTO['estadoTicket']) => {
  switch (estado) {
    case 'GRATIS':      return 'text-green-400 bg-green-500/10 border-green-500/30';
    case 'PAGADO':      return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    case 'PENDIENTE':   return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    case 'CANCELADO':   return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'REEMBOLSADO': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    default:            return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

const ticketEstadoIcon = (estado: TicketResponseDTO['estadoTicket']) => {
  switch (estado) {
    case 'GRATIS':      return <CheckCircle size={12} />;
    case 'PAGADO':      return <CreditCard size={12} />;
    case 'PENDIENTE':   return <Clock size={12} />;
    case 'CANCELADO':   return <Ban size={12} />;
    case 'REEMBOLSADO': return <XCircle size={12} />;
    default: return null;
  }
};

export default function EventoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { evento, historial, isLoading, error, fetchById } = useEvento();
  const { isAdmin } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderMsg, setReminderMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('info');

  // Tickets del evento
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchById(Number(id));
  }, [id]);

  // Load tickets when the 'tickets' tab is selected
  useEffect(() => {
    if (activeTab === 'tickets' && id) {
      setLoadingTickets(true);
      setTicketsError(null);
      eventoService
        .getTicketsEvento(Number(id))
        .then((data) => setTickets(data))
        .catch(() => setTicketsError('Error al cargar los tickets de este evento.'))
        .finally(() => setLoadingTickets(false));
    }
  }, [activeTab, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} /> Cargando evento...
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-400">{error ?? 'Evento no encontrado.'}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-400 hover:underline">Volver</button>
      </div>
    );
  }

  const tabClass = (tab: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-xl transition-all ${
      activeTab === tab
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-6">
      <PageHeader
        title="Detalle del Evento"
        subtitle={`ID: ${evento.idEvento}`}
        action={
          <div className="flex items-center gap-3">
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20"
              >
                <X size={16} /> Cancelar Edición
              </button>
            )}
            {isAdmin && (
              <button
                onClick={async () => {
                  setSendingReminder(true);
                  setReminderMsg(null);
                  try {
                    const axios = (await import('../../../lib/axios')).default;
                    const { data } = await axios.post('/api/v1/notificaciones/recordatorios/ejecutar');
                    setReminderMsg('Recordatorios enviados con éxito');
                  } catch {
                    setReminderMsg('Error al enviar recordatorios');
                  } finally {
                    setSendingReminder(false);
                  }
                }}
                disabled={sendingReminder}
                className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-400 transition hover:bg-amber-500/20 disabled:opacity-50"
              >
                <Bell size={16} />
                {sendingReminder ? 'Enviando...' : 'Enviar Recordatorios'}
              </button>
            )}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10">
              <ArrowLeft size={16} /> Volver
            </button>
          </div>
        }
      />

      {reminderMsg && (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          {reminderMsg}
        </div>
      )}

      {/* ── TAB BAR ── */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <button className={tabClass('info')} onClick={() => setActiveTab('info')}>
          <span className="flex items-center gap-2"><CalendarDays size={14} /> Información</span>
        </button>
        <button className={tabClass('historial')} onClick={() => setActiveTab('historial')}>
          <span className="flex items-center gap-2"><MapPin size={14} /> Historial</span>
        </button>
        <button className={tabClass('tickets')} onClick={() => setActiveTab('tickets')}>
          <span className="flex items-center gap-2">
            <Ticket size={14} /> Tickets
            {tickets.length > 0 && (
              <span className="ml-1 text-xs bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-full">
                {tickets.length}
              </span>
            )}
          </span>
        </button>
        <button className={tabClass('staff')} onClick={() => setActiveTab('staff')}>
          <span className="flex items-center gap-2"><Users size={14} /> Staff</span>
        </button>
        <button className={tabClass('reembolsos')} onClick={() => setActiveTab('reembolsos')}>
          <span className="flex items-center gap-2"><RefreshCcw size={14} /> Reembolsos</span>
        </button>
        <button className={tabClass('pagos')} onClick={() => setActiveTab('pagos')}>
          <span className="flex items-center gap-2"><DollarSign size={14} /> Pagos</span>
        </button>
      </div>

      {/* ── INFO TAB ── */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
              {isEditing ? (
                <EventoForm
                  initialData={evento}
                  isLoading={isUpdating}
                  onSubmit={async (data) => {
                    setIsUpdating(true);
                    try {
                      await eventoService.update(Number(id), data);
                      setIsEditing(false);
                      fetchById(Number(id));
                    } finally {
                      setIsUpdating(false);
                    }
                  }}
                />
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white">{evento.nombreEvento}</h2>
                      <p className="text-sm text-gray-400 mt-2">{evento.descripcionEvento || 'Sin descripción'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <Badge status={evento.estadoEvento} className="text-sm px-3 py-1" />
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 hover:bg-white/10 text-sm text-gray-300 transition-colors"
                      >
                        <Pencil size={16} className="text-indigo-400" /> Editar Info
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <CalendarDays className="text-indigo-400" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Fecha / Hora</p>
                        <p className="text-sm text-white font-medium">{evento.fechaEvento} - {evento.horaEvento}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <MapPin className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Lugar</p>
                        <p className="text-sm text-white font-medium">{evento.lugarEvento}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Información Logística</h3>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Capacidad Máxima</p>
                  <p className="text-sm text-white font-medium">{evento.capacidadMaxima} asistentes</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cupos Disponibles</p>
                  <p className="text-sm text-white font-medium">{evento.capacidadDisponible} cupos</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Parqueadero</p>
                  <p className="text-sm text-white font-medium">
                    {evento.tieneParqueadero ? `Sí (${evento.cuposParqueadero} cupos)` : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Referencia de Ubicación</p>
                  <p className="text-sm text-white font-medium">{evento.referenciaUbicacion || 'N/A'}</p>
                </div>
                {evento.esDePago && (
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm text-white font-medium">{evento.precio} {evento.moneda}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORIAL TAB ── */}
      {activeTab === 'historial' && (
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Historial de Auditoría</h3>
          {historial.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No hay registros en el historial.</p>
          ) : (
            <div className="space-y-4">
              {historial.map(h => (
                <div key={h.idHistorialEvento} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                    <div className="w-px h-full bg-white/10 my-1"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Transición de <Badge status={h.estadoAnterior ?? 'N/A'}/> a <Badge status={h.estadoNuevo}/></p>
                    {h.comentario && <p className="text-sm text-gray-400 mt-1 italic">"{h.comentario}"</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Por: <span className="text-indigo-400">{h.nombreUsuarioResponsable}</span>{' '}
                      el {new Date(String(h.fechaCambio)).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TICKETS TAB ── */}
      {activeTab === 'tickets' && (
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users size={18} className="text-indigo-400" />
              Inscritos al Evento
            </h3>
            {!loadingTickets && !ticketsError && (
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full font-medium">
                {tickets.length} ticket(s)
              </span>
            )}
          </div>

          {loadingTickets ? (
            <div className="flex justify-center py-10 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={18} /> Cargando tickets...
            </div>
          ) : ticketsError ? (
            <div className="text-center py-8 text-red-400 text-sm">{ticketsError}</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10">
              <Ticket className="mx-auto text-gray-700 mb-3" size={40} />
              <p className="text-gray-500 text-sm">Nadie se ha inscrito aún a este evento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
                    <th className="pb-3 pr-4 font-medium">Ticket ID</th>
                    <th className="pb-3 pr-4 font-medium">Usuario</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 pr-4 font-medium">Monto</th>
                    <th className="pb-3 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tickets.map((t) => (
                    <tr key={t.idTicket} className="hover:bg-white/3 transition-colors">
                      <td className="py-3 pr-4 font-mono text-gray-300">#{t.idTicket}</td>
                      <td className="py-3 pr-4"><UsuarioCell userId={t.idUsuario} /></td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${ticketEstadoStyle(t.estadoTicket)}`}>
                          {ticketEstadoIcon(t.estadoTicket)}
                          {t.estadoTicket}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-400">
                        {t.montoPagado > 0 ? `${t.montoPagado} ${t.moneda}` : '—'}
                      </td>
                      <td className="py-3 text-gray-500 text-xs">
                        {new Date(t.creadoEn).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── STAFF TAB ── */}
      {activeTab === 'staff' && (
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users size={18} className="text-indigo-400" />
              Gestión de Staff
            </h3>
          </div>
          <EventoStaffTab idEvento={Number(id)} />
        </div>
      )}

      {activeTab === 'reembolsos' && (
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <RefreshCcw size={18} className="text-indigo-400" />
              Solicitudes de Reembolso
            </h3>
          </div>
          <EventoReembolsosTab idEvento={Number(id)} />
        </div>
      )}

      {activeTab === 'pagos' && (
        <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <DollarSign size={18} className="text-indigo-400" />
              Pagos del Evento
            </h3>
          </div>
          <EventoPagosTab idEvento={Number(id)} />
        </div>
      )}
    </div>
  );
}
