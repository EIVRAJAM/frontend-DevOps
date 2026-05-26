import React, { useEffect, useState } from 'react';
import { Plus, Eye, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { StatusToggle } from '../../../components/ui/StatusToggle';
import { Modal } from '../../../components/ui/Modal';
import { UsuarioForm } from '../components/UsuarioForm';
import { useUsuarios } from '../hooks/useUsuarios';
import { UsuarioResponse } from '../types/usuario.types';

const columns: ColumnDef<UsuarioResponse>[] = [
  {
    header: 'Nombre Completo',
    accessor: 'nombres',
    render: (_, row) => (
      <div>
        <p className="font-medium text-white">{row.nombres} {row.apellidos}</p>
      </div>
    ),
  },
  {
    header: 'Documento',
    accessor: 'documento',
    render: (value) => (
      <span className="text-sm text-gray-400 font-mono">{String(value)}</span>
    ),
  },
  {
    header: 'Teléfono',
    accessor: 'telefono',
    render: (value) => (
      <span className="text-sm text-gray-400">{String(value || '—')}</span>
    ),
  },
  {
    header: 'Estado',
    accessor: 'estado',
    render: (value) => <Badge status={String(value)} />,
  },
];

export default function UsuariosListPage() {
  const { usuarios, pagination, isLoading, error, fetch, patchStatus, applyFilters } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ nombres: searchQuery || undefined, page: 0 } as any);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetch({ page: 0, size: 10 });
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    fetch();
  };

  const columnsWithActions: ColumnDef<UsuarioResponse>[] = [
    ...columns,
    {
      header: 'Acciones',
      accessor: 'idUsuario',
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <StatusToggle
            status={row.estado ?? 'ACTIVO'}
            onActivate={() => patchStatus(row.idUsuario, 'activar')}
            onDeactivate={() => patchStatus(row.idUsuario, 'desactivar')}
            onBlock={() => patchStatus(row.idUsuario, 'bloquear')}
          />
          <Link to={`/dashboard/usuarios/${row.idUsuario}`} className="text-gray-400 hover:text-indigo-400 transition-colors shrink-0 ml-1" title="Ver / Editar Detalles">
            <Eye size={18} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema, sus roles y estados."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus size={16} />
            Nuevo Usuario
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o documento..."
            className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60"
          />
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            onClick={handleClearSearch}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Limpiar
          </button>
        </form>
      </div>

      <DataTable
        columns={columnsWithActions}
        data={usuarios}
        pagination={pagination}
        isLoading={isLoading}
        emptyMessage="No se encontraron usuarios."
        keyExtractor={(row) => row.idUsuario}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Usuario" size="lg">
        <UsuarioForm onSuccess={handleCreateSuccess} />
      </Modal>
    </div>
  );
}
