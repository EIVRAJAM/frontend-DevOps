import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reembolsoService } from '../services/reembolso.service';
import {
  SolicitudReembolsoResponse,
  SolicitarReembolsoFormValues,
  AprobarReembolsoRequest,
  RechazarReembolsoRequest,
} from '../types/reembolso.types';

export const useMisSolicitudes = () => {
  return useQuery<SolicitudReembolsoResponse[], Error>({
    queryKey: ['reembolsos', 'mis-solicitudes'],
    queryFn: () => reembolsoService.getMisSolicitudes(),
  });
};

export const useSolicitarReembolso = () => {
  const queryClient = useQueryClient();
  return useMutation<SolicitudReembolsoResponse, Error, { ticketId: number; values: SolicitarReembolsoFormValues }>({
    mutationFn: ({ ticketId, values }) => reembolsoService.solicitarReembolso(ticketId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

export const useCancelarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => reembolsoService.cancelarSolicitud(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos'] });
    },
  });
};

export const useReembolsosPorEvento = (eventoId: number) => {
  return useQuery<SolicitudReembolsoResponse[], Error>({
    queryKey: ['reembolsos', 'evento', eventoId],
    queryFn: () => reembolsoService.getReembolsosPorEvento(eventoId),
    enabled: eventoId > 0,
  });
};

export const useRevisarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation<SolicitudReembolsoResponse, Error, { eventoId: number; solicitudId: number }>({
    mutationFn: ({ eventoId, solicitudId }) => reembolsoService.revisarSolicitud(eventoId, solicitudId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', 'evento', variables.eventoId] });
    },
  });
};

export const useAprobarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation<SolicitudReembolsoResponse, Error, { eventoId: number; solicitudId: number; payload: AprobarReembolsoRequest }>({
    mutationFn: ({ eventoId, solicitudId, payload }) => reembolsoService.aprobarSolicitud(eventoId, solicitudId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', 'evento', variables.eventoId] });
    },
  });
};

export const useRechazarSolicitud = () => {
  const queryClient = useQueryClient();
  return useMutation<SolicitudReembolsoResponse, Error, { eventoId: number; solicitudId: number; payload: RechazarReembolsoRequest }>({
    mutationFn: ({ eventoId, solicitudId, payload }) => reembolsoService.rechazarSolicitud(eventoId, solicitudId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', 'evento', variables.eventoId] });
    },
  });
};

export const useMarcarReembolsada = () => {
  const queryClient = useQueryClient();
  return useMutation<SolicitudReembolsoResponse, Error, { eventoId: number; solicitudId: number }>({
    mutationFn: ({ eventoId, solicitudId }) => reembolsoService.marcarReembolsada(eventoId, solicitudId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reembolsos', 'evento', variables.eventoId] });
    },
  });
};
