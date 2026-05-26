import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { InscripcionResponse, TicketResponseDTO, MisEventosCanceladosResponse } from '../types/ticket.types';

export const ticketService = {
  // POST /api/v1/tickets/evento/{eventoId}  — Any authenticated user
  inscribirse: async (eventoId: number): Promise<InscripcionResponse> => {
    const { data } = await axiosInstance.post<InscripcionResponse>(
      API_ENDPOINTS.TICKETS.INSCRIBIR(eventoId)
    );
    return data;
  },

  // GET /api/v1/tickets/mis-tickets  — Any authenticated user
  getMisTickets: async (): Promise<TicketResponseDTO[]> => {
    const { data } = await axiosInstance.get<TicketResponseDTO[]>(API_ENDPOINTS.TICKETS.MIS_TICKETS);
    return data;
  },

  // GET /api/v1/tickets/{id}  — Owner or ADMIN
  getById: async (id: number): Promise<TicketResponseDTO> => {
    const { data } = await axiosInstance.get<TicketResponseDTO>(API_ENDPOINTS.TICKETS.BY_ID(id));
    return data;
  },

  // POST /api/v1/tickets/{id}/cancelar  — Owner or ADMIN
  cancelar: async (id: number): Promise<TicketResponseDTO> => {
    const { data } = await axiosInstance.post<TicketResponseDTO>(API_ENDPOINTS.TICKETS.CANCELAR(id));
    return data;
  },

  // GET /api/v1/tickets/{id}/qr  — Owner or ADMIN. Returns a blob URL for use in <img>
  getQrImageUrl: async (id: number): Promise<string> => {
    const { data } = await axiosInstance.get<Blob>(API_ENDPOINTS.TICKETS.QR(id), {
      responseType: 'blob',
    });
    return URL.createObjectURL(data);
  },

  getMisEventosCancelados: async (): Promise<MisEventosCanceladosResponse> => {
    const { data } = await axiosInstance.get<MisEventosCanceladosResponse>('/api/v1/tickets/mis-eventos-cancelados');
    return data;
  },
};
