import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import {
  FuncionalidadResponse,
  FuncionalidadRequest,
  FuncionalidadUpdateRequest,
  FuncionalidadFilterRequest
} from '../types/funcionalidad.types';

export const funcionalidadService = {
  // GET /api/v1/funcionalidad
  getAll: async (filters: FuncionalidadFilterRequest = {}): Promise<FuncionalidadResponse[]> => {
    const params: Record<string, any> = {};
    if (filters.status) params.status = filters.status;
    if (filters.id_padre !== undefined) params.id_padre = filters.id_padre;

    const { data } = await axiosInstance.get<FuncionalidadResponse[]>(API_ENDPOINTS.FUNCIONALIDADES.BASE, { params });
    return data;
  },

  // GET /api/v1/funcionalidad/{id}
  getById: async (id: number): Promise<FuncionalidadResponse> => {
    const { data } = await axiosInstance.get<FuncionalidadResponse>(API_ENDPOINTS.FUNCIONALIDADES.BY_ID(id));
    return data;
  },

  // POST /api/v1/funcionalidad
  create: async (payload: FuncionalidadRequest): Promise<FuncionalidadResponse> => {
    const { data } = await axiosInstance.post<FuncionalidadResponse>(API_ENDPOINTS.FUNCIONALIDADES.BASE, payload);
    return data;
  },

  // PUT /api/v1/funcionalidad/{id}
  update: async (id: number, payload: FuncionalidadUpdateRequest): Promise<FuncionalidadResponse> => {
    const { data } = await axiosInstance.put<FuncionalidadResponse>(API_ENDPOINTS.FUNCIONALIDADES.BY_ID(id), payload);
    return data;
  },

  // PATCH /api/v1/funcionalidad/{id}/activar
  activar: async (id: number): Promise<FuncionalidadResponse> => {
    const { data } = await axiosInstance.patch<FuncionalidadResponse>(API_ENDPOINTS.FUNCIONALIDADES.ACTIVAR(id));
    return data;
  },

  // PATCH /api/v1/funcionalidad/{id}/desactivar
  desactivar: async (id: number): Promise<FuncionalidadResponse> => {
    const { data } = await axiosInstance.patch<FuncionalidadResponse>(API_ENDPOINTS.FUNCIONALIDADES.DESACTIVAR(id));
    return data;
  },
};
