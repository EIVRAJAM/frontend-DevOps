import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | string;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: PaginationProps;
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

function getCellValue<T>(row: T, accessor: string): unknown {
  return accessor.split('.').reduce((obj: unknown, key) => {
    if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
    return undefined;
  }, row);
}

export function DataTable<T>({
  columns,
  data,
  pagination,
  isLoading = false,
  emptyMessage = 'No hay registros para mostrar.',
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest text-gray-400 ${col.className ?? ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <Loader2 className="mx-auto animate-spin text-indigo-400" size={28} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor ? keyExtractor(row, index) : index}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                >
                  {columns.map((col) => {
                    const raw = getCellValue(row, col.accessor as string);
                    return (
                      <td key={col.header} className={`px-5 py-4 text-gray-300 ${col.className ?? ''}`}>
                        {col.render ? col.render(raw, row) : String(raw ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <span className="text-xs text-gray-500">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
