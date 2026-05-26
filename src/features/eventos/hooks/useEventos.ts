import { useState, useCallback } from 'react';
import { eventoService } from '../services/evento.service';
import {
  EventoResponse,
  EventoFilterRequest,
  EventoDisponiblesFilterRequest,
  MisEventosFilterRequest,
  PageResponse,
  ComentarioRequest,
} from '../types/evento.types';

/**
 * Mode controls which backend endpoint is called:
 *  - 'admin'       → GET /api/v1/eventos           (ROLE_ADMIN only)
 *  - 'mis-eventos' → GET /api/v1/eventos/mis-eventos (ROLE_ORGANIZER / ROLE_ADMIN)
 *  - 'disponibles' → GET /api/v1/eventos/disponibles (all authenticated)
 */
export type EventosFetchMode = 'admin' | 'mis-eventos' | 'disponibles';

interface UseEventosState {
  data: PageResponse<EventoResponse> | null;
  isLoading: boolean;
  error: string | null;
}

export const useEventos = (mode: EventosFetchMode = 'admin') => {
  const [state, setState] = useState<UseEventosState>({
    data: null,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<
    EventoFilterRequest | EventoDisponiblesFilterRequest | MisEventosFilterRequest
  >({ page: 0, size: mode === 'admin' ? 10 : 20 });

  const fetch = useCallback(
    async (
      newFilters?:
        | EventoFilterRequest
        | EventoDisponiblesFilterRequest
        | MisEventosFilterRequest
    ) => {
      const activeFilters = newFilters ?? filters;
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        let result: PageResponse<EventoResponse>;
        if (mode === 'disponibles') {
          result = await eventoService.getDisponibles(
            activeFilters as EventoDisponiblesFilterRequest
          );
        } else if (mode === 'mis-eventos') {
          result = await eventoService.getMisEventos(
            activeFilters as MisEventosFilterRequest
          );
        } else {
          // 'admin' — only ROLE_ADMIN should reach this
          result = await eventoService.getAll(activeFilters as EventoFilterRequest);
        }
        setState({ data: result, isLoading: false, error: null });
      } catch {
        setState((prev) => ({ ...prev, isLoading: false, error: 'Error al cargar eventos.' }));
      }
    },
    [filters, mode]
  );

  const changePage = useCallback(
    (page: number) => {
      const updated = { ...filters, page: page - 1 };
      setFilters(updated);
      fetch(updated);
    },
    [filters, fetch]
  );

  const applyFilters = useCallback(
    (
      newFilters: Partial<
        EventoFilterRequest & EventoDisponiblesFilterRequest & MisEventosFilterRequest
      >
    ) => {
      const updated = { ...filters, ...newFilters, page: 0 };
      setFilters(updated);
      fetch(updated);
    },
    [filters, fetch]
  );

  // Transition actions — only meaningful for admin/mis-eventos modes
  const actionTransition = useCallback(
    async (
      id: number,
      action: 'publicar' | 'cerrar' | 'activar' | 'cancelar' | 'desactivar',
      payload?: ComentarioRequest
    ) => {
      try {
        if (action === 'cancelar' || action === 'desactivar') {
          await eventoService[action](id, payload!);
        } else {
          await eventoService[action as 'publicar' | 'cerrar' | 'activar'](id);
        }
        fetch(filters);
      } catch {
        setState((prev) => ({ ...prev, error: `Error al ${action} el evento.` }));
      }
    },
    [filters, fetch]
  );

  return {
    eventos: state.data?.content ?? [],
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
    actionTransition,
  };
};
