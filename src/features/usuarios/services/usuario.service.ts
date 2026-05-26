import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import {
  UsuarioResponse,
  UsuarioCreatedResponse,
  UsuarioCreateRequest,
  UsuarioUpdateRequest,
  UsuarioFilterRequest,
  UsuarioOrganizadorResponse,
  CompleteStatusResponse,
  PageResponse,
} from '../types/usuario.types';

export const usuarioService = {
  // GET /api/v1/usuarios?page=0&size=10&...filters
  getAll: async (filters: UsuarioFilterRequest = {}): Promise<PageResponse<UsuarioResponse>> => {
    const params = {
      page: filters.page ?? 0,
      size: filters.size ?? 10,
      ...(filters.documento && { documento: filters.documento }),
      ...(filters.nombres && { nombres: filters.nombres }),
      ...(filters.apellidos && { apellidos: filters.apellidos }),
      ...(filters.nombreRol && { nombreRol: filters.nombreRol }),
    };
    const { data } = await axiosInstance.get<PageResponse<UsuarioResponse>>(
      API_ENDPOINTS.USUARIOS.BASE,
      { params }
    );
    return data;
  },

  // GET /api/v1/usuarios/all (no pagination fallback)
  getAllNoPage: async (): Promise<UsuarioResponse[]> => {
    const { data } = await axiosInstance.get<UsuarioResponse[]>(API_ENDPOINTS.USUARIOS.ALL);
    return data;
  },

  // GET /api/v1/usuarios/{id}
  getById: async (id: number): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.get<UsuarioResponse>(API_ENDPOINTS.USUARIOS.BY_ID(id));
    return data;
  },

  // GET /api/v1/usuarios/document/{doc}
  getByDocument: async (documento: string): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.get<UsuarioResponse>(
      API_ENDPOINTS.USUARIOS.BY_DOCUMENT(documento)
    );
    return data;
  },

  // POST /api/v1/usuarios
  create: async (payload: UsuarioCreateRequest): Promise<UsuarioCreatedResponse> => {
    const { data } = await axiosInstance.post<UsuarioCreatedResponse>(
      API_ENDPOINTS.USUARIOS.BASE,
      payload
    );
    return data;
  },

  // PUT /api/v1/usuarios/${id}/admin
  updateAdmin: async (id: number, payload: UsuarioUpdateRequest): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.put<UsuarioResponse>(
      API_ENDPOINTS.USUARIOS.UPDATE_ADMIN(id),
      payload
    );
    return data;
  },

  // GET /api/v1/usuarios/id
  getCurrentUser: async (): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.get<UsuarioResponse>(API_ENDPOINTS.USUARIOS.CURRENT_USER);
    return data;
  },

  // GET /api/v1/usuarios/{id}/organizador
  getByIdOrganizador: async (id: number): Promise<UsuarioOrganizadorResponse> => {
    const { data } = await axiosInstance.get<UsuarioOrganizadorResponse>(API_ENDPOINTS.USUARIOS.ORGANIZADOR(id));
    return data;
  },

  // PATCH /api/v1/usuarios/me
  updateSelf: async (payload: Partial<UsuarioUpdateRequest>): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(API_ENDPOINTS.USUARIOS.UPDATE_SELF, payload);
    return data;
  },

  // PATCH /api/v1/usuarios/{id}/activar
  activar: async (id: number): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(API_ENDPOINTS.USUARIOS.ACTIVAR(id));
    return data;
  },

  // PATCH /api/v1/usuarios/{id}/desactivar
  desactivar: async (id: number): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(API_ENDPOINTS.USUARIOS.DESACTIVAR(id));
    return data;
  },

  // PATCH /api/v1/usuarios/{id}/bloquear
  bloquear: async (id: number): Promise<UsuarioResponse> => {
    const { data } = await axiosInstance.patch<UsuarioResponse>(API_ENDPOINTS.USUARIOS.BLOQUEAR(id));
    return data;
  },

  // GET /api/v1/usuarios/complete-status
  getCompleteStatus: async (): Promise<CompleteStatusResponse> => {
    const { data } = await axiosInstance.get<CompleteStatusResponse>(API_ENDPOINTS.USUARIOS.COMPLETE_STATUS);
    return data;
  },

  // GET /api/v1/usuarios/organizador
  searchOrganizador: async (params: { nombres?: string; size?: number }): Promise<PageResponse<UsuarioOrganizadorResponse>> => {
    const { data } = await axiosInstance.get<PageResponse<UsuarioOrganizadorResponse>>(API_ENDPOINTS.USUARIOS.SEARCH_ORGANIZADOR, {
      params: { ...params, page: 0 },
    });
    return data;
  },
};
