import axiosInstance from '../../../lib/axios';
import { API_ENDPOINTS } from '../../../config/apiEndpoints';
import {
  AccesoAdminResponse,
  AccesoUserResponse,
  CreateAccesoAdminRequest,
  UpdateAccesoRequest,
  UpdatePasswordAdminRequest,
  UpdatePasswordUserRequest,
} from '../types/acceso.types';

export const accesoService = {
  // GET /api/v1/accesos
  getAll: async (): Promise<AccesoAdminResponse[]> => {
    const { data } = await axiosInstance.get<AccesoAdminResponse[]>(API_ENDPOINTS.ACCESOS.BASE);
    return data;
  },

  // GET /api/v1/accesos/{idUsuario}
  getByIdUsuario: async (idUsuario: number): Promise<AccesoAdminResponse> => {
    const { data } = await axiosInstance.get<AccesoAdminResponse>(API_ENDPOINTS.ACCESOS.BY_USER(idUsuario));
    return data;
  },

  // POST /api/v1/accesos
  create: async (payload: CreateAccesoAdminRequest): Promise<AccesoAdminResponse> => {
    const { data } = await axiosInstance.post<AccesoAdminResponse>(
      API_ENDPOINTS.ACCESOS.BASE,
      payload
    );
    return data;
  },

  // PUT /api/v1/accesos/{idUsuario}
  update: async (idUsuario: number, payload: UpdateAccesoRequest): Promise<AccesoAdminResponse | AccesoUserResponse> => {
    const { data } = await axiosInstance.put<AccesoAdminResponse | AccesoUserResponse>(
      API_ENDPOINTS.ACCESOS.BY_USER(idUsuario),
      payload
    );
    return data;
  },

  // PATCH /api/v1/accesos/{idUsuario}/activar
  activar: async (idUsuario: number): Promise<AccesoAdminResponse> => {
    const { data } = await axiosInstance.patch<AccesoAdminResponse>(API_ENDPOINTS.ACCESOS.ACTIVAR(idUsuario));
    return data;
  },

  // PATCH /api/v1/accesos/{idUsuario}/desactivar
  desactivar: async (idUsuario: number): Promise<AccesoAdminResponse | AccesoUserResponse> => {
    const { data } = await axiosInstance.patch<AccesoAdminResponse | AccesoUserResponse>(API_ENDPOINTS.ACCESOS.DESACTIVAR(idUsuario));
    return data;
  },

  // PATCH /api/v1/accesos/{idUsuario}/bloquear
  bloquear: async (idUsuario: number): Promise<AccesoAdminResponse> => {
    const { data } = await axiosInstance.patch<AccesoAdminResponse>(API_ENDPOINTS.ACCESOS.BLOQUEAR(idUsuario));
    return data;
  },

  // PATCH /api/v1/accesos/cambiar-password
  cambiarPassword: async (payload: UpdatePasswordUserRequest): Promise<AccesoUserResponse> => {
    const { data } = await axiosInstance.patch<AccesoUserResponse>(
      API_ENDPOINTS.ACCESOS.CHANGE_PASSWORD,
      payload
    );
    return data;
  },

  // PATCH /api/v1/accesos/{idUsuario}/cambiar-password-admin
  cambiarPasswordAdmin: async (idUsuario: number, payload: UpdatePasswordAdminRequest): Promise<AccesoAdminResponse> => {
    const { data } = await axiosInstance.patch<AccesoAdminResponse>(
      API_ENDPOINTS.ACCESOS.ADMIN_CHANGE_PASSWORD(idUsuario),
      payload
    );
    return data;
  },
};
