import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import { SesionResponseDto, SesionFilterRequest, PageResponse } from '../types/sesion.types';

export const sesionService = {
  // GET /api/v1/sesiones
  getAll: async (filters: SesionFilterRequest = {}): Promise<PageResponse<SesionResponseDto>> => {
    const params = {
      page: filters.page ?? 0,
      size: filters.size ?? 10,
      ...(filters.idUsuario && { id_usuario: filters.idUsuario }),
      ...(filters.fechaInicio && { fechaInicio: filters.fechaInicio }),
      ...(filters.fechaFin && { fechaFin: filters.fechaFin }),
      ...(filters.activa !== undefined && { activa: filters.activa }),
    };
    const { data } = await axiosInstance.get<PageResponse<SesionResponseDto>>(API_ENDPOINTS.SESIONES.BASE, { params });
    return data;
  },

  // GET /api/v1/sesiones/activas
  getActivas: async (page = 0, size = 10): Promise<PageResponse<SesionResponseDto>> => {
    const { data } = await axiosInstance.get<PageResponse<SesionResponseDto>>(API_ENDPOINTS.SESIONES.ACTIVAS, {
      params: { page, size }
    });
    return data;
  },

  // GET /api/v1/sesiones/ultima
  getUltima: async (): Promise<SesionResponseDto> => {
    const { data } = await axiosInstance.get<SesionResponseDto>(API_ENDPOINTS.SESIONES.ULTIMA);
    return data;
  },

  // DELETE /api/v1/sesiones/{id}
  deleteSesion: async (idSesion: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.SESIONES.BY_ID(idSesion));
  },
};
