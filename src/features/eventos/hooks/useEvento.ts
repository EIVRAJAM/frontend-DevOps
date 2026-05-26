import { useState, useCallback } from 'react';
import { eventoService } from '../services/evento.service';
import { EventoResponse, UpdateEventoRequest, ComentarioRequest, HistorialEventoResponse } from '../types/evento.types';

interface UseEventoState {
  evento: EventoResponse | null;
  historial: HistorialEventoResponse[];
  isLoading: boolean;
  error: string | null;
}

export const useEvento = () => {
  const [state, setState] = useState<UseEventoState>({
    evento: null,
    historial: [],
    isLoading: false,
    error: null,
  });

  const fetchById = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [eventoData, historialData] = await Promise.all([
        eventoService.getById(id),
        eventoService.getHistorial(id).catch(() => []) // Historial is separate, shouldn't crash fetch
      ]);
      setState({ evento: eventoData, historial: historialData, isLoading: false, error: null });
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Evento no encontrado.' }));
    }
  }, []);

  const update = useCallback(async (id: number, payload: UpdateEventoRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await eventoService.update(id, payload);
      setState(prev => ({ ...prev, evento: result, isLoading: false, error: null }));
      return result;
    } catch {
      setState(prev => ({ ...prev, isLoading: false, error: 'Error al actualizar el evento.' }));
      return null;
    }
  }, []);

  const actionTransition = useCallback(
    async (
      id: number,
      action: 'publicar' | 'cerrar' | 'activar' | 'cancelar' | 'desactivar',
      payload?: ComentarioRequest
    ) => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        let result: EventoResponse;
        if (action === 'cancelar' || action === 'desactivar') {
          result = await eventoService[action](id, payload!);
        } else {
          result = await eventoService[action as 'publicar' | 'cerrar' | 'activar'](id);
        }
        // Refresh historial after a transition
        const historialData = await eventoService.getHistorial(id).catch(() => state.historial);
        setState({ evento: result, historial: historialData, isLoading: false, error: null });
      } catch {
        setState(prev => ({ ...prev, isLoading: false, error: `Error al ${action} el evento.` }));
      }
    },
    [state.historial]
  );

  return { ...state, fetchById, update, actionTransition };
};
