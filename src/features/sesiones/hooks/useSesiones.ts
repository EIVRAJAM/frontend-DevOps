import { useState, useCallback } from 'react';
import { sesionService } from '../services/sesion.service';
import { SesionResponseDto, SesionFilterRequest, PageResponse } from '../types/sesion.types';

interface UseSesionesState {
  data: PageResponse<SesionResponseDto> | null;
  isLoading: boolean;
  error: string | null;
}

export const useSesiones = () => {
  const [state, setState] = useState<UseSesionesState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<SesionFilterRequest>({ page: 0, size: 10 });

  const fetch = useCallback(async (newFilters?: SesionFilterRequest) => {
    const activeFilters = newFilters ?? filters;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await sesionService.getAll(activeFilters);
      setState({ data: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al cargar sesiones.' }));
    }
  }, [filters]);

  const changePage = useCallback((page: number) => {
    const updated = { ...filters, page: page - 1 };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);

  const applyFilters = useCallback((newFilters: Partial<SesionFilterRequest>) => {
    const updated = { ...filters, ...newFilters, page: 0 };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);

  const deleteSesion = useCallback(async (idSesion: number) => {
    try {
      await sesionService.deleteSesion(idSesion);
      fetch(filters);
    } catch {
      setState(prev => ({ ...prev, error: 'Error al desconectar la sesión.' }));
    }
  }, [filters, fetch]);

  return {
    sesiones: state.data?.content ?? [],
    pagination: state.data
      ? {
          page: (state.data.number ?? 0) + 1,
          totalPages: state.data.totalPages,
          onPageChange: changePage,
        }
      : undefined,
    isLoading: state.isLoading,
    error: state.error,
    filters,
    fetch,
    applyFilters,
    deleteSesion,
  };
};
