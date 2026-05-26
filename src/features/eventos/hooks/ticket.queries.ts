import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticket.service';
import { InscripcionResponse, TicketResponseDTO, MisEventosCanceladosResponse } from '../types/ticket.types';

// POST /api/v1/tickets/evento/{eventoId}
export const useInscribirEvento = () => {
  return useMutation<InscripcionResponse, Error, number>({
    mutationFn: (eventoId: number) => ticketService.inscribirse(eventoId),
  });
};

// GET /api/v1/tickets/mis-tickets
export const useMisTickets = () => {
  return useQuery<TicketResponseDTO[], Error>({
    queryKey: ['mis-tickets'],
    queryFn: () => ticketService.getMisTickets(),
  });
};

// GET /api/v1/tickets/{id}
export const useTicket = (id: number) => {
  return useQuery<TicketResponseDTO, Error>({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getById(id),
    enabled: id > 0,
  });
};

// POST /api/v1/tickets/{id}/cancelar
export const useCancelarTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<TicketResponseDTO, Error, number>({
    mutationFn: (id: number) => ticketService.cancelar(id),
    onSuccess: () => {
      // Invalidar la lista de tickets del usuario al cancelar
      queryClient.invalidateQueries({ queryKey: ['mis-tickets'] });
    },
  });
};

export const useMisEventosCancelados = () => {
  return useQuery<MisEventosCanceladosResponse, Error>({
    queryKey: ['mis-eventos-cancelados'],
    queryFn: () => ticketService.getMisEventosCancelados(),
  });
};
