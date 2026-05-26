import { useQuery } from '@tanstack/react-query';
import { PagoResponse } from '../types/evento.types';
import axiosInstance from '../../../lib/axios';

export const usePagosPorEvento = (eventoId: number) => {
  return useQuery<PagoResponse[], Error>({
    queryKey: ['pagos', 'evento', eventoId],
    queryFn: () => axiosInstance.get<PagoResponse[]>(`/api/v1/eventos/${eventoId}/pagos`).then(r => r.data),
    enabled: eventoId > 0,
  });
};
