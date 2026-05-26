import React, { useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { DataTable, ColumnDef } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { useEvento } from '../hooks/useEvento';

export default function EventosHistorialPage() {
  const { historial, isLoading, error, fetchById } = useEvento();

  useEffect(() => {
    // Para simplificar la demo: Hardcodeamos a que consulte historial del evento ID 1.
    // O si en la ruta hay un selector, lo sacamos de la URL (no hay params por ahora en el placeholder).
    // Idealmente el ID se pasaria por URL /eventos/:id/historial
    // Por el diseño de placeholders, esto funcionará para la estructura del dashboard.
  }, []);

  const columns: ColumnDef<any>[] = [
    {
       header: 'Fecha Cambio',
       accessor: 'fechaCambio',
       render: (value) => <span className="text-gray-400 text-sm">{new Date(String(value)).toLocaleString()}</span>
    },
    { header: 'Estado Anterior', accessor: 'estadoAnterior', render: (val) => val ? <Badge status={String(val)} /> : <span className="text-gray-600">—</span> },
    { header: 'Estado Nuevo', accessor: 'estadoNuevo', render: (val) => <Badge status={String(val)} /> },
    { header: 'Usuario', accessor: 'nombreUsuarioResponsable' },
    { header: 'Motivo', accessor: 'comentario', className: 'max-w-[250px] truncate' },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Historial de Eventos"
        subtitle="Auditoría de todos los cambios de estado (BORRADOR -> PUBLICADO -> CANCELADO, etc)."
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Nota: En la arquitectura final este componente es mejor consumido como pestaña
          dentro de EventoDetailPage.tsx. En este layout lo pintamos independiente. */}
      <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
        Para ver el historial real selecciona "Acciones - Historial" en el Detalle del Evento (WIP).
      </div>

      <DataTable
        columns={columns}
        data={historial}
        isLoading={isLoading}
        emptyMessage="Selecciona un evento para ver su historial."
      />
    </div>
  );
}
