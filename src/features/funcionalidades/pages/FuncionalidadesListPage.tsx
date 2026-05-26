import React, { useEffect, useState } from 'react';
import { Plus, GitMerge, Eye } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { StatusToggle } from '../../../components/ui/StatusToggle';
import { Modal } from '../../../components/ui/Modal';
import { FuncionalidadForm } from '../components/FuncionalidadForm';
import { FuncionalidadDetailModal } from '../components/FuncionalidadDetailModal';
import { useFuncionalidades } from '../hooks/useFuncionalidades';
import { usePermissions } from '../../../hooks/usePermissions';
import { funcionalidadService } from '../services/funcionalidad.service';
import { FuncionalidadResponse, FuncionalidadRequest } from '../types/funcionalidad.types';

export default function FuncionalidadesListPage() {
  const { funcionalidades, isLoading, error, fetch, patchStatus } = useFuncionalidades();
  const { isAdmin } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [viewItem, setViewItem] = useState<FuncionalidadResponse | null>(null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleCreate = async (data: FuncionalidadRequest) => {
    setIsCreating(true);
    try {
      await funcionalidadService.create(data);
      setIsModalOpen(false);
      fetch();
    } finally {
      setIsCreating(false);
    }
  };

  const columns: ColumnDef<FuncionalidadResponse>[] = [
    { header: 'ID', accessor: 'idFuncionalidad', className: 'w-16 text-gray-400' },
    {
      header: 'Estructura / Nombre',
      accessor: 'nombreFuncionalidad',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {row.idPadre && <GitMerge size={16} className="text-gray-500" />}
          <div>
            <p className="font-medium text-white">{row.nombreFuncionalidad}</p>
            {row.urlFuncionalidad && <p className="text-xs text-gray-500 mt-0.5">{row.urlFuncionalidad}</p>}
          </div>
        </div>
      ),
    },
    {
      header: 'Jerarquía',
      accessor: 'idPadre',
      render: (value) => value ? <span className="text-xs text-gray-400">Hijo de #{String(value)}</span> : <span className="text-xs text-indigo-400 font-semibold">Raíz</span>,
    },
    {
      header: 'Estado',
      accessor: 'estado',
      render: (value) => <Badge status={String(value)} />,
    },
    {
      header: 'Acciones',
      accessor: 'idFuncionalidad',
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <StatusToggle
            status={row.estado}
            onActivate={() => patchStatus(row.idFuncionalidad, 'activar')}
            onDeactivate={() => patchStatus(row.idFuncionalidad, 'desactivar')}
          />
          <button onClick={() => setViewItem(row)} className="text-gray-400 hover:text-indigo-400 transition-colors" title="Ver Detalles">
            <Eye size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Gestión de Funcionalidades"
        subtitle="Administra las rutas y estructura del menú del sistema de forma jerárquica."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus size={16} />
            Nueva Funcionalidad
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Info indicator for Admins */}
      <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
        Las funcionalidades definidas como <strong>Raíz</strong> pueden anidar funcionalidades especificando su ID como "Padre".
      </div>

      <DataTable
        columns={columns}
        data={funcionalidades}
        isLoading={isLoading}
        emptyMessage="No hay funcionalidades configuradas en el sistema."
        keyExtractor={(row) => String(row.idFuncionalidad)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Funcionalidad" size="md">
        <FuncionalidadForm onSubmit={handleCreate} isLoading={isCreating} />
      </Modal>

      <FuncionalidadDetailModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        funcionalidad={viewItem}
        onUpdateSuccess={() => {
          fetch(); // Refresh data on successful update
        }}
      />
    </div>
  );
}
