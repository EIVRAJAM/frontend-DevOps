import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import axiosInstance from '../../../src/lib/axios';
import { ticketService } from '../../../src/features/eventos/services/ticket.service';

describe('ticketService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('inscribirse', () => {
    it('inscribes user to an event', async () => {
      const mockResponse = { idTicket: 10, estadoTicket: 'GRATIS', codigoQr: 'QR-NEW', clientSecret: null };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await ticketService.inscribirse(1);
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/v1/tickets/evento/1');
    });
  });

  describe('getMisTickets', () => {
    it('fetches user tickets', async () => {
      const mockTickets = [{ idTicket: 1, estadoTicket: 'PAGADO' }];
      axiosInstance.get.mockResolvedValue({ data: mockTickets });

      const result = await ticketService.getMisTickets();
      expect(result).toEqual(mockTickets);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/tickets/mis-tickets');
    });
  });

  describe('getById', () => {
    it('fetches ticket by id', async () => {
      const mockTicket = { idTicket: 1, estadoTicket: 'PAGADO' };
      axiosInstance.get.mockResolvedValue({ data: mockTicket });

      const result = await ticketService.getById(1);
      expect(result).toEqual(mockTicket);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/tickets/1');
    });
  });

  describe('cancelar', () => {
    it('cancels a ticket', async () => {
      const mockResponse = { idTicket: 1, estadoTicket: 'CANCELADO' };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await ticketService.cancelar(1);
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/v1/tickets/1/cancelar');
    });
  });

  describe('getMisEventosCancelados', () => {
    it('fetches cancelled events for user', async () => {
      axiosInstance.get.mockResolvedValue({ data: { total: 0, tickets: [] } });
      await ticketService.getMisEventosCancelados();
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/tickets/mis-eventos-cancelados');
    });
  });
});
