import { useState, useCallback } from 'react';
import { funcionalidadService } from '../services/funcionalidad.service';
import { FuncionalidadResponse, FuncionalidadUpdateRequest } from '../types/funcionalidad.types';

interface UseFuncionalidadState {
  funcionalidad: FuncionalidadResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useFuncionalidad = () => {
  const [state, setState] = useState<UseFuncionalidadState>({
    funcionalidad: null,
    isLoading: false,
    error: null,
  });

  const fetchById = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await funcionalidadService.getById(id);
      setState({ funcionalidad: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Funcionalidad no encontrada.' }));
    }
  }, []);

  const update = useCallback(async (id: number, payload: FuncionalidadUpdateRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await funcionalidadService.update(id, payload);
      setState(prev => ({ ...prev, funcionalidad: result, isLoading: false, error: null }));
      return result;
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al actualizar.' }));
      return null;
    }
  }, []);

  const patchStatus = useCallback(
    async (id: number, action: 'activar' | 'desactivar') => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const result = await funcionalidadService[action](id);
        setState({ funcionalidad: result, isLoading: false, error: null });
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: `Error al ${action} la funcionalidad.` }));
      }
    },
    []
  );

  return { ...state, fetchById, update, patchStatus };
};
