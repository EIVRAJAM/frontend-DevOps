import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import axiosInstance from '../../../src/lib/axios';
import { eventoService } from '../../../src/features/eventos/services/evento.service';

describe('eventoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches paginated events with default params', async () => {
      const mockResponse = {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 10,
        first: true,
        last: true,
      };
      axiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await eventoService.getAll();
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/eventos', {
        params: { page: 0, size: 10 },
      });
    });

    it('passes filter params to the request', async () => {
      axiosInstance.get.mockResolvedValue({ data: { content: [] } });
      await eventoService.getAll({ estadoEvento: 'PUBLICADO', page: 1 });
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/eventos', {
        params: expect.objectContaining({ estadoEvento: 'PUBLICADO', page: 1 }),
      });
    });
  });

  describe('getDisponibles', () => {
    it('fetches available events', async () => {
      axiosInstance.get.mockResolvedValue({ data: { content: [] } });
      const result = await eventoService.getDisponibles();
      expect(axiosInstance.get).toHaveBeenCalledWith(
        '/api/v1/eventos/disponibles',
        { params: expect.objectContaining({ page: 0, size: 20 }) }
      );
    });
  });

  describe('getById', () => {
    it('fetches event by id', async () => {
      const mockEvent = { idEvento: 1, nombreEvento: 'Test' };
      axiosInstance.get.mockResolvedValue({ data: mockEvent });
      const result = await eventoService.getById(1);
      expect(result).toEqual(mockEvent);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/eventos/1');
    });
  });

  describe('create', () => {
    it('creates a new event', async () => {
      const payload = {
        nombreEvento: 'New Event',
        fechaEvento: '2025-06-01',
        horaEvento: '18:00',
        lugarEvento: 'Test',
        capacidadMaxima: 100,
        tieneParqueadero: false,
        esDePago: false,
      };
      const mockResponse = { idEvento: 99, ...payload };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await eventoService.create(payload);
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/v1/eventos', payload);
    });
  });

  describe('update', () => {
    it('updates an event', async () => {
      const payload = { nombreEvento: 'Updated' };
      const mockResponse = { idEvento: 1, nombreEvento: 'Updated' };
      axiosInstance.put.mockResolvedValue({ data: mockResponse });

      const result = await eventoService.update(1, payload);
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.put).toHaveBeenCalledWith('/api/v1/eventos/1', payload);
    });
  });

  describe('publicar', () => {
    it('publishes an event', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { idEvento: 1 } });
      await eventoService.publicar(1);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/v1/eventos/1/publicar');
    });
  });

  describe('cancelar', () => {
    it('cancels an event with comment', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { idEvento: 1 } });
      await eventoService.cancelar(1, { comentario: 'Bad weather' });
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        '/api/v1/eventos/1/cancelar',
        { comentario: 'Bad weather' }
      );
    });
  });

  describe('staff', () => {
    it('assigns staff to event', async () => {
      const mockStaff = { idEventoStaff: 1, idEvento: 1, idUsuario: 5 };
      axiosInstance.post.mockResolvedValue({ data: mockStaff });

      await eventoService.assignStaff(1, { idUsuario: 5 });
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/eventos/1/staff',
        { idUsuario: 5 }
      );
    });

    it('gets staff list', async () => {
      axiosInstance.get.mockResolvedValue({ data: [] });
      await eventoService.getStaff(1);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/eventos/1/staff');
    });
  });

  describe('check-in', () => {
    it('performs check-in', async () => {
      axiosInstance.post.mockResolvedValue({ data: { checkinRealizado: true } });
      await eventoService.checkIn(1, { codigoQr: 'QR-123' });
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/eventos/1/check-in',
        { codigoQr: 'QR-123' }
      );
    });

    it('gets check-in summary', async () => {
      axiosInstance.get.mockResolvedValue({ data: { totalInscritos: 10 } });
      await eventoService.getCheckInResumen(1);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/eventos/1/check-in/resumen');
    });
  });
});
