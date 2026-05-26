import React from 'react';
import { reembolsoEstadoIcon, reembolsoEstadoStyle } from '../utils/reembolsoHelpers';
import { EstadoSolicitudReembolso } from '../types/reembolso.types';

export const ReembolsoStatusBadge: React.FC<{ estado: EstadoSolicitudReembolso }> = ({ estado }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${reembolsoEstadoStyle(estado)}`}>
    {reembolsoEstadoIcon(estado)} {estado}
  </span>
);
