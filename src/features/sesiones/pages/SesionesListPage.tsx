import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, Eye } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { SesionDetailModal } from '../components/SesionDetailModal';
import { useSesiones } from '../hooks/useSesiones';
import { usePermissions } from '../../../hooks/usePermissions';
import { SesionResponseDto } from '../types/sesion.types';

export default function SesionesListPage() {
  const { sesiones, pagination, isLoading, error, fetch, applyFilters, deleteSesion } = useSesiones();
  const { isAdmin } = usePermissions();
  const [viewItem, setViewItem] = useState<SesionResponseDto | null>(null);
  const [disconnectId, setDisconnectId] = useState<number | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleDelete = (idSesion: number) => {
    deleteSesion(idSesion);
    setDisconnectId(null);
  };

  const columns: ColumnDef<SesionResponseDto>[] = [
    { header: 'ID', accessor: 'idSesion', className: 'w-16 text-gray-500' },
    {
      header: 'Usuario',
      accessor: 'idUsuario',
      render: (_, row) => (
        <div>
          <p className="font-medium text-white">{row.nombresUsuario} {row.apellidosUsuario}</p>
          <p className="text-xs text-gray-400 mt-0.5">ID User: {row.idUsuario}</p>
        </div>
      ),
    },
    {
      header: 'Fecha Inicio',
      accessor: 'fechaInicio',
      render: (value) => <span className="text-sm text-gray-300">{new Date(String(value)).toLocaleString()}</span>,
    },
    {
      header: 'Fecha Cierre',
      accessor: 'fechaFin',
      render: (value) => value ? <span className="text-sm text-gray-400">{new Date(String(value)).toLocaleString()}</span> : <span className="text-sm text-gray-600">—</span>,
    },
    {
      header: 'Estado',
      accessor: 'activa',
      render: (value) => <Badge status={value ? 'ACTIVA' : 'INACTIVA'} />,
    },
    {
      header: 'Identificador (JTI)',
      accessor: 'tokenJti',
      render: (value) => <span className="text-xs text-gray-500 font-mono" title={String(value)}>{String(value).split('-')[0]}...</span>,
    },
    {
      header: 'Acciones',
      accessor: 'idSesion',
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <button onClick={() => setViewItem(row)} className="text-gray-400 hover:text-indigo-400 transition-colors" title="Detalles / Desconectar">
            <Eye size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Auditoría de Sesiones"
        subtitle="Monitoreo de accesos y revocación de JWT tokens."
      />

      <div className="mb-6 flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 text-sm text-gray-400">
            <Search size={16} /> Filtros:
         </div>
         <select
            className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none"
            onChange={(e) => {
              const val = e.target.value;
              applyFilters({ activa: val === '' ? undefined : val === 'true' });
            }}
         >
            <option value="">Todas las Sesiones</option>
            <option value="true">Activas</option>
            <option value="false">Cerradas</option>
         </select>
         <input 
            type="number"
            placeholder="ID Usuario"
            className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none placeholder-gray-600 w-32"
            onChange={(e) => {
               const val = e.target.value;
               applyFilters({ idUsuario: val ? Number(val) : undefined });
            }}
         />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={sesiones}
        pagination={pagination}
        isLoading={isLoading}
        emptyMessage="No se encontraron sesiones."
        keyExtractor={(row) => String(row.idSesion)}
      />

      <SesionDetailModal 
        isOpen={!!viewItem} 
        onClose={() => setViewItem(null)} 
        sesion={viewItem} 
        onDisconnect={(id) => setDisconnectId(id)}
        isAdmin={isAdmin}
      />

      <Modal isOpen={disconnectId !== null} onClose={() => setDisconnectId(null)} title="Forzar Desconexión" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert size={20} className="text-red-400 shrink-0" />
            <p className="text-sm text-red-300">¿Estás seguro de forzar el cierre de esta sesión? Esto invalidará el token del usuario.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDisconnectId(null)} className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
              Cancelar
            </button>
            <button onClick={() => disconnectId && handleDelete(disconnectId)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors">
              Forzar Desconexión
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
