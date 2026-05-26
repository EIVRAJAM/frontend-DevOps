import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

import axiosInstance from '../../../src/lib/axios';
import { usuarioService } from '../../../src/features/usuarios/services/usuario.service';

describe('usuarioService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('fetches paginated users with default params', async () => {
      const mockResponse = { content: [], totalPages: 0, totalElements: 0 };
      axiosInstance.get.mockResolvedValue({ data: mockResponse });

      await usuarioService.getAll();
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/usuarios', {
        params: { page: 0, size: 10 },
      });
    });

    it('passes filter params', async () => {
      axiosInstance.get.mockResolvedValue({ data: { content: [] } });
      await usuarioService.getAll({ nombres: 'Juan', page: 2 });
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/usuarios', {
        params: expect.objectContaining({ nombres: 'Juan', page: 2 }),
      });
    });
  });

  describe('getById', () => {
    it('fetches user by id', async () => {
      const mockUser = { idUsuario: 1, nombres: 'Juan' };
      axiosInstance.get.mockResolvedValue({ data: mockUser });

      const result = await usuarioService.getById(1);
      expect(result).toEqual(mockUser);
      expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/usuarios/1');
    });
  });

  describe('create', () => {
    it('creates a new user', async () => {
      const payload = {
        documento: '123456789',
        nombres: 'Nuevo',
        apellidos: 'Usuario',
        genero: 'masculino',
        fechaNacimiento: '1990-01-01',
        telefono: '3001234567',
      };
      const mockResponse = { idUsuario: 99, mensaje: 'Created' };
      axiosInstance.post.mockResolvedValue({ data: mockResponse });

      const result = await usuarioService.create(payload);
      expect(result).toEqual(mockResponse);
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/v1/usuarios', payload);
    });
  });

  describe('activar/desactivar/bloquear', () => {
    it('activates a user', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { estado: 'ACTIVO' } });
      await usuarioService.activar(1);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/v1/usuarios/1/activar');
    });

    it('deactivates a user', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { estado: 'INACTIVO' } });
      await usuarioService.desactivar(1);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/v1/usuarios/1/desactivar');
    });

    it('blocks a user', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { estado: 'BLOQUEADO' } });
      await usuarioService.bloquear(1);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/v1/usuarios/1/bloquear');
    });
  });

  describe('updateSelf', () => {
    it('updates current user profile', async () => {
      const payload = { telefono: '3009999999' };
      axiosInstance.patch.mockResolvedValue({ data: { ...payload } });

      await usuarioService.updateSelf(payload);
      expect(axiosInstance.patch).toHaveBeenCalledWith('/api/v1/usuarios/me', payload);
    });
  });
});
