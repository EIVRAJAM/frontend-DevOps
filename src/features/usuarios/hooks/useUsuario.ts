import { useState, useCallback } from 'react';
import { usuarioService } from '../services/usuario.service';
import { UsuarioResponse, UsuarioUpdateRequest } from '../types/usuario.types';

interface UseUsuarioState {
  usuario: UsuarioResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useUsuario = () => {
  const [state, setState] = useState<UseUsuarioState>({
    usuario: null,
    isLoading: false,
    error: null,
  });

  const fetchById = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await usuarioService.getById(id);
      setState({ usuario: result, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Usuario no encontrado.' }));
    }
  }, []);

  const update = useCallback(async (id: number, payload: UsuarioUpdateRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await usuarioService.updateAdmin(id, payload);
      setState({ usuario: result, isLoading: false, error: null });
      return result;
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al actualizar el usuario.' }));
      return null;
    }
  }, []);

  const patchStatus = useCallback(
    async (id: number, action: 'activar' | 'desactivar' | 'bloquear') => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const result = await usuarioService[action](id);
        setState({ usuario: result, isLoading: false, error: null });
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: `Error al ${action} el usuario.` }));
      }
    },
    []
  );

  return { ...state, fetchById, update, patchStatus };
};
