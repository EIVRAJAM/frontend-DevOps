import React, { useEffect, useState } from 'react';
import { Plus, ListFilter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { StatusToggle } from '../../../components/ui/StatusToggle';
import { Modal } from '../../../components/ui/Modal';
import { EventoForm } from '../components/EventoForm';
import { useEventos } from '../hooks/useEventos';
import { usePermissions } from '../../../hooks/usePermissions';
import { eventoService } from '../services/evento.service';
import { EventoResponse, CreateEventoRequest, EstadoEvento } from '../types/evento.types';

export default function EventosListPage() {
  const { isAdmin, isOrganizer } = usePermissions();

  const fetchMode = isAdmin ? 'admin' : 'mis-eventos';

  const { eventos, pagination, isLoading, error, fetch, applyFilters, actionTransition } =
    useEventos(fetchMode);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [reasonDialog, setReasonDialog] = useState<{ type: string; eventId: number } | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleCreate = async (data: CreateEventoRequest) => {
    setIsCreating(true);
    try {
      await eventoService.create(data);
      setIsModalOpen(false);
      fetch();
    } finally {
      setIsCreating(false);
    }
  };

  const columns: ColumnDef<EventoResponse>[] = [
    { header: 'ID', accessor: 'idEvento', className: 'w-16 text-gray-500' },
    {
      header: 'Evento',
      accessor: 'nombreEvento',
      render: (_, row) => (
        <div>
          <p className="font-medium text-white">{row.nombreEvento}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.fechaEvento} - {row.lugarEvento}</p>
        </div>
      ),
    },
    {
      header: 'Capacidad',
      accessor: 'capacidadMaxima',
      render: (value) => <span className="text-gray-400 text-sm">{String(value)}</span>,
    },
    {
      header: 'Estado de Publicación',
      accessor: 'estadoEvento',
      render: (value) => <Badge status={String(value)} />,
    },
    {
      header: 'Estado Sistema',
      accessor: 'estado',
      render: (value) => <Badge status={String(value)} />,
    },
    {
      header: 'Acciones (Publicación)',
      accessor: 'acciones',
      render: (_, row) => {
        // BORRADOR → PUBLICADO, CANCELADO
        // PUBLICADO → CERRADO, CANCELADO
        const estado = row.estadoEvento;
        return (
          <div className="flex items-center gap-2">
            {estado === 'BORRADOR' && (
              <button
                onClick={() => actionTransition(row.idEvento, 'publicar')}
                className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md hover:bg-indigo-500/20 transition-colors"
              >
                Publicar
              </button>
            )}
            {estado === 'PUBLICADO' && (
              <button
                onClick={() => actionTransition(row.idEvento, 'cerrar')}
                className="text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2 py-1 rounded-md hover:bg-slate-500/20 transition-colors"
              >
                Cerrar
              </button>
            )}
            {(estado === 'BORRADOR' || estado === 'PUBLICADO') && (
              <button
                onClick={() => { setReasonDialog({ type: 'cancelar', eventId: row.idEvento }); setReason(''); }}
                className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md hover:bg-amber-500/20 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        );
      },
    },
    {
       header: 'Acciones (Sistema)',
       accessor: 'sistema',
       render: (_, row) => (
         <div className="flex items-center gap-4">
           <StatusToggle
             status={row.estado}
             onActivate={() => actionTransition(row.idEvento, 'activar')}
              onDeactivate={() => { setReasonDialog({ type: 'desactivar', eventId: row.idEvento }); setReason(''); }}
           />
           <Link to={`/dashboard/eventos/${row.idEvento}`} className="text-gray-400 hover:text-indigo-400 transition-colors" title="Ver / Editar Logística">
             <Eye size={18} />
           </Link>
         </div>
       )
    }
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title={isAdmin ? 'Gestión de Eventos' : 'Mis Eventos'}
        subtitle={
          isAdmin
            ? 'Administra la planeación, publicación y cierre de todos los eventos.'
            : 'Gestiona los eventos que has creado.'
        }
        action={
          (isAdmin || isOrganizer) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              <Plus size={16} />
              Nuevo Evento
            </button>
          )
        }
      />

      {/* Basic Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 text-sm text-gray-400">
            <ListFilter size={16} /> Filtros:
         </div>
         <select
            className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none"
            onChange={(e) => applyFilters({ estadoEvento: (e.target.value || undefined) as EstadoEvento })}
         >
            <option value="">Todos los Estados</option>
            <option value="BORRADOR">Borrador</option>
            <option value="PUBLICADO">Publicado</option>
            <option value="CERRADO">Cerrado</option>
            <option value="CANCELADO">Cancelado</option>
         </select>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={eventos}
        pagination={pagination}
        isLoading={isLoading}
        emptyMessage="No se encontraron eventos."
        keyExtractor={(row) => String(row.idEvento)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Evento" size="lg">
        <EventoForm onSubmit={handleCreate} isLoading={isCreating} />
      </Modal>
      <Modal isOpen={reasonDialog !== null} onClose={() => setReasonDialog(null)} title={reasonDialog?.type === 'cancelar' ? 'Cancelar Evento' : 'Desactivar Evento'} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            {reasonDialog?.type === 'cancelar'
              ? 'La cancelación es irreversible. Explica el motivo:'
              : 'Explica el motivo de la desactivación:'}
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
            rows={3}
            placeholder={reasonDialog?.type === 'cancelar' ? 'Motivo de cancelación...' : 'Motivo de desactivación...'}
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setReasonDialog(null)} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
              Cancelar
            </button>
            <button
              onClick={() => {
                if (reasonDialog && reason.trim()) {
                  actionTransition(reasonDialog.eventId, reasonDialog.type as any, { comentario: reason.trim() });
                  setReasonDialog(null);
                  setReason('');
                }
              }}
              disabled={!reason.trim()}
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
