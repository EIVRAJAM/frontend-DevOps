import { useState, useCallback } from 'react';
import { funcionalidadService } from '../services/funcionalidad.service';
import { FuncionalidadResponse, FuncionalidadFilterRequest } from '../types/funcionalidad.types';

interface UseFuncionalidadesState {
  data: FuncionalidadResponse[];
  isLoading: boolean;
  error: string | null;
}

export const useFuncionalidades = () => {
  const [state, setState] = useState<UseFuncionalidadesState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<FuncionalidadFilterRequest>({});

  const fetch = useCallback(async (newFilters?: FuncionalidadFilterRequest) => {
    const activeFilters = newFilters ?? filters;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await funcionalidadService.getAll(activeFilters);
      setState({ data: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al cargar funcionalidades.' }));
    }
  }, [filters]);

  const applyFilters = useCallback((newFilters: Partial<FuncionalidadFilterRequest>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetch(updated);
  }, [filters, fetch]);

  const patchStatus = useCallback(
    async (id: number, action: 'activar' | 'desactivar') => {
      try {
        await funcionalidadService[action](id);
        fetch(filters);
      } catch {
        setState(prev => ({ ...prev, error: `Error al ${action} la funcionalidad.` }));
      }
    },
    [filters, fetch]
  );

  return {
    funcionalidades: state.data,
    isLoading: state.isLoading,
    error: state.error,
    filters,
    fetch,
    applyFilters,
    patchStatus,
  };
};
