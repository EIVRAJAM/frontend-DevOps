import axiosInstance from '../../../lib/axios';
import { DashboardStatsResponse, EventoFinanzasResponse } from '../types/dashboard.types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStatsResponse> => {
    const { data } = await axiosInstance.get<DashboardStatsResponse>('/api/v1/dashboard/stats');
    return data;
  },

  getFinanzasByEvento: async (eventoId: number): Promise<EventoFinanzasResponse> => {
    const { data } = await axiosInstance.get<EventoFinanzasResponse>(`/api/v1/dashboard/eventos/${eventoId}/finanzas`);
    return data;
  },
};
