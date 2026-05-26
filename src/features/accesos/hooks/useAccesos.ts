import { useState, useCallback } from 'react';
import { accesoService } from '../services/acceso.service';
import { AccesoAdminResponse } from '../types/acceso.types';

interface UseAccesosState {
  data: AccesoAdminResponse[];
  isLoading: boolean;
  error: string | null;
}

export const useAccesos = () => {
  const [state, setState] = useState<UseAccesosState>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await accesoService.getAll();
      setState({ data: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al cargar accesos.' }));
    }
  }, []);

  const patchStatus = useCallback(
    async (idUsuario: number, action: 'activar' | 'desactivar' | 'bloquear') => {
      try {
        await accesoService[action](idUsuario);
        // Refresh full list after status change
        fetch();
      } catch {
        setState(prev => ({ ...prev, error: `Error al ${action} el acceso.` }));
      }
    },
    [fetch]
  );

  return {
    accesos: state.data,
    isLoading: state.isLoading,
    error: state.error,
    fetch,
    patchStatus,
  };
};
