import { useState, useCallback } from 'react';
import { usuarioService } from '../services/usuario.service';
import { UsuarioResponse, UsuarioFilterRequest, PageResponse } from '../types/usuario.types';

interface UseUsuariosState {
  data: PageResponse<UsuarioResponse> | null;
  isLoading: boolean;
  error: string | null;
}

export const useUsuarios = () => {
  const [state, setState] = useState<UseUsuariosState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<UsuarioFilterRequest>({ page: 0, size: 10 });

  const fetch = useCallback(async (newFilters?: UsuarioFilterRequest) => {
    const activeFilters = newFilters ?? filters;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await usuarioService.getAll(activeFilters);
      setState({ data: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al cargar usuarios.' }));
    }
  }, [filters]);

  const changePage = useCallback((page: number) => {
    const updated = { ...filters, page: page - 1 };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);

  const applyFilters = useCallback((newFilters: Partial<UsuarioFilterRequest>) => {
    const updated = { ...filters, ...newFilters, page: 0 };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);

  const patchStatus = useCallback(
    async (id: number, action: 'activar' | 'desactivar' | 'bloquear') => {
      try {
        await usuarioService[action](id);
        // Refresh current page after status change
        fetch(filters);
      } catch {
        setState(prev => ({ ...prev, error: `Error al ${action} el usuario.` }));
      }
    },
    [filters, fetch]
  );

  return {
    usuarios: state.data?.content ?? [],
    pagination: state.data
      ? {
          page: (state.data.number ?? 0) + 1, // Display as 1-indexed
          totalPages: state.data.totalPages,
          onPageChange: changePage,
        }
      : undefined,
    isLoading: state.isLoading,
    error: state.error,
    filters,
    fetch,
    applyFilters,
    patchStatus,
  };
};
