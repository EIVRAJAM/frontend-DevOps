import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

import axiosInstance from '../../../src/lib/axios';
import { reembolsoService } from '../../../src/features/reembolsos/services/reembolso.service';

describe('reembolsoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('solicitarReembolso', () => {
    it('sends FormData with all required fields', async () => {
      const mockResponse = { idSolicitud: 1, estado: 'SOLICITADA' };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const values = {
        motivoSolicitud: 'No puedo asistir al evento por razones personales',
        medioReembolso: 'NEQUI',
        titularCuenta: 'Juan Perez',
        documentoTitular: '123456789',
        correoContacto: 'juan@test.com',
        telefonoContacto: '3001234567',
      };

      const result = await reembolsoService.solicitarReembolso(5, values);
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/api/v1/tickets/5/reembolso',
        expect.any(FormData)
      );
    });
  });

  describe('getMisSolicitudes', () => {
    it('fetches user refund requests', async () => {
      axiosInstance.get.mockResolvedValue({ data: [] });
      const result = await reembolsoService.getMisSolicitudes();
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/reembolsos/mis-solicitudes');
    });
  });

  describe('cancelarSolicitud', () => {
    it('cancels a refund request', async () => {
      axiosInstance.patch.mockResolvedValue({});
      await reembolsoService.cancelarSolicitud(1);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/v1/reembolsos/1/cancelar');
    });
  });

  describe('aprobarSolicitud', () => {
    it('approves a refund request', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { estado: 'APROBADA' } });
      await reembolsoService.aprobarSolicitud(1, 2, { comentario: 'Approved' });
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        '/api/v1/eventos/1/reembolsos/2/aprobar',
        { comentario: 'Approved' }
      );
    });
  });

  describe('rechazarSolicitud', () => {
    it('rejects a refund request', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { estado: 'RECHAZADA' } });
      await reembolsoService.rechazarSolicitud(1, 2, { comentario: 'Invalid' });
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        '/api/v1/eventos/1/reembolsos/2/rechazar',
        { comentario: 'Invalid' }
      );
    });
  });
});
