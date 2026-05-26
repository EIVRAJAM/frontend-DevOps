import { useState, useCallback } from 'react';
import { accesoService } from '../services/acceso.service';
import { AccesoAdminResponse, UpdateAccesoRequest, UpdatePasswordAdminRequest } from '../types/acceso.types';

interface UseAccesoState {
  acceso: AccesoAdminResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useAcceso = () => {
  const [state, setState] = useState<UseAccesoState>({
    acceso: null,
    isLoading: false,
    error: null,
  });

  const fetchByIdUsuario = useCallback(async (idUsuario: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await accesoService.getByIdUsuario(idUsuario);
      setState({ acceso: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Acceso no encontrado.' }));
    }
  }, []);

  const update = useCallback(async (idUsuario: number, payload: UpdateAccesoRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await accesoService.update(idUsuario, payload) as AccesoAdminResponse;
      setState({ acceso: result, isLoading: false, error: null });
      return result;
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al actualizar el acceso.' }));
      return null;
    }
  }, []);

  const changePasswordAdmin = useCallback(async (idUsuario: number, payload: UpdatePasswordAdminRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await accesoService.cambiarPasswordAdmin(idUsuario, payload);
      setState({ acceso: result, isLoading: false, error: null });
      return result;
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al cambiar la contraseña.' }));
      return null;
    }
  }, []);

  const patchStatus = useCallback(
    async (idUsuario: number, action: 'activar' | 'desactivar' | 'bloquear') => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const result = await accesoService[action](idUsuario) as AccesoAdminResponse;
        setState({ acceso: result, isLoading: false, error: null });
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: `Error al ${action} el acceso.` }));
      }
    },
    []
  );

  return { ...state, fetchByIdUsuario, update, changePasswordAdmin, patchStatus };
};
