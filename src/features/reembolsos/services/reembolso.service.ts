import axiosInstance from '../../../lib/axios';
import {
  SolicitudReembolsoResponse,
  SolicitarReembolsoFormValues,
  AprobarReembolsoRequest,
  RechazarReembolsoRequest,
} from '../types/reembolso.types';

export const reembolsoService = {
  solicitarReembolso: async (ticketId: number, values: SolicitarReembolsoFormValues): Promise<SolicitudReembolsoResponse> => {
    const formData = new FormData();
    formData.append('motivoSolicitud', values.motivoSolicitud);
    formData.append('medioReembolso', values.medioReembolso);
    formData.append('titularCuenta', values.titularCuenta);
    formData.append('documentoTitular', values.documentoTitular);
    formData.append('correoContacto', values.correoContacto);
    formData.append('telefonoContacto', values.telefonoContacto);
    if (values.entidadFinanciera) formData.append('entidadFinanciera', values.entidadFinanciera);
    if (values.tipoCuenta) formData.append('tipoCuenta', values.tipoCuenta);
    if (values.numeroCuenta) formData.append('numeroCuenta', values.numeroCuenta);
    if (values.observaciones) formData.append('observaciones', values.observaciones);
    if (values.certificadoCuenta?.[0]) formData.append('certificadoCuenta', values.certificadoCuenta[0]);
    if (values.documentoAdicional?.[0]) formData.append('documentoAdicional', values.documentoAdicional[0]);

    const { data } = await axiosInstance.post<SolicitudReembolsoResponse>(
      `/api/v1/tickets/${ticketId}/reembolso`,
      formData
    );
    return data;
  },

  getMisSolicitudes: async (): Promise<SolicitudReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse[]>('/api/v1/reembolsos/mis-solicitudes');
    return data;
  },

  cancelarSolicitud: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/api/v1/reembolsos/${id}/cancelar`);
  },

  getReembolsosPorEvento: async (eventoId: number): Promise<SolicitudReembolsoResponse[]> => {
    const { data } = await axiosInstance.get<SolicitudReembolsoResponse[]>(`/api/v1/eventos/${eventoId}/reembolsos`);
    return data;
  },

  revisarSolicitud: async (eventoId: number, solicitudId: number): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(`/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/revisar`);
    return data;
  },

  aprobarSolicitud: async (eventoId: number, solicitudId: number, payload: AprobarReembolsoRequest): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(`/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/aprobar`, payload);
    return data;
  },

  rechazarSolicitud: async (eventoId: number, solicitudId: number, payload: RechazarReembolsoRequest): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(`/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/rechazar`, payload);
    return data;
  },

  marcarReembolsada: async (eventoId: number, solicitudId: number): Promise<SolicitudReembolsoResponse> => {
    const { data } = await axiosInstance.patch<SolicitudReembolsoResponse>(`/api/v1/eventos/${eventoId}/reembolsos/${solicitudId}/marcar-reembolsado`);
    return data;
  },
};
