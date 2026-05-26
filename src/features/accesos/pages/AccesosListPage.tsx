import React, { useEffect, useState } from 'react';
import { Plus, ShieldAlert, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { StatusToggle } from '../../../components/ui/StatusToggle';
import { Modal } from '../../../components/ui/Modal';
import { CreateAccesoForm } from '../components/CreateAccesoForm';
import { useAccesos } from '../hooks/useAccesos';
import { usePermissions } from '../../../hooks/usePermissions';
import { accesoService } from '../services/acceso.service';
import { AccesoAdminResponse, CreateAccesoAdminRequest } from '../types/acceso.types';

export default function AccesosListPage() {
  const { accesos, isLoading, error, fetch, patchStatus } = useAccesos();
  const { isAdmin } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleCreate = async (data: CreateAccesoAdminRequest) => {
    setIsCreating(true);
    try {
      await accesoService.create(data);
      setIsModalOpen(false);
      fetch();
    } finally {
      setIsCreating(false);
    }
  };

  const columns: ColumnDef<AccesoAdminResponse>[] = [
    { header: 'ID Usuario', accessor: 'idUsuario', className: 'w-24 text-gray-400' },
    {
      header: 'Credenciales',
      accessor: 'username',
      render: (_, row) => (
        <div>
          <p className="font-medium text-white">{row.username}</p>
          <p className="text-xs text-gray-500 mt-0.5">{row.correoAcceso}</p>
        </div>
      ),
    },
    {
      header: 'Intentos Fallidos',
      accessor: 'intentosFallidos',
      render: (value) => {
        const count = Number(value);
        return (
          <span className={`text-xs font-mono px-2 py-1 rounded-md ${count > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-500'}`}>
            {count}
          </span>
        );
      },
      className: 'text-center',
    },
    {
      header: 'Último Login',
      accessor: 'ultimoLogin',
      render: (value) => (
        <span className="text-xs text-gray-400">
          {value ? new Date(String(value)).toLocaleString() : 'Nunca'}
        </span>
      ),
    },
    {
      header: 'Fecha Registro',
      accessor: 'creadoEn',
      render: (value) => (
        <span className="text-xs text-gray-400">
          {value ? new Date(String(value)).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessor: 'estadoCuenta',
      render: (value) => <Badge status={String(value ?? 'ACTIVO')} />,
    },
    {
      header: 'Acciones',
      accessor: 'uuidAcceso',
      render: (_, row) => (
        <div className="flex items-center gap-4">
          <StatusToggle
            status={row.estadoCuenta}
            onActivate={() => patchStatus(row.idUsuario, 'activar')}
            onDeactivate={() => patchStatus(row.idUsuario, 'desactivar')}
            onBlock={() => patchStatus(row.idUsuario, 'bloquear')}
          />
          <Link to={`/dashboard/accesos/${row.idUsuario}`} className="text-gray-400 hover:text-indigo-400 transition-colors" title="Ver Detalles">
            <Eye size={18} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Gestión de Accesos"
        subtitle="Administra las credenciales y el estado de ingreso de todos los usuarios."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus size={16} />
            Crear Acceso
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Info banner for Admin capabilities */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
        <ShieldAlert size={20} className="mt-0.5 text-blue-400 shrink-0" />
        <div className="text-sm text-blue-200/80">
          <p className="font-semibold text-blue-300">Nivel Analítico (Administrador)</p>
          <p className="mt-1">
            Los accesos bloqueados por múltiples intentos fallidos pueden ser restablecidos acá mediante la acción de "Activar".
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={accesos}
        isLoading={isLoading}
        emptyMessage="No hay registros de accesos."
        keyExtractor={(row) => String(row.idUsuario)}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Acceso Administrativo" size="sm">
        <CreateAccesoForm onSubmit={handleCreate} isLoading={isCreating} />
      </Modal>
    </div>
  );
}
