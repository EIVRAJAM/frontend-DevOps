import { authHandlers } from './auth.js';
import { eventoHandlers } from './eventos.js';
import { usuarioHandlers } from './usuarios.js';
import { dashboardHandlers } from './dashboard.js';
import { reembolsoHandlers } from './reembolsos.js';
import { funcionalidadHandlers } from './funcionalidades.js';
import { accesoHandlers } from './accesos.js';
import { sesionHandlers } from './sesiones.js';
import { ticketHandlers } from './tickets.js';

export const handlers = [
  ...authHandlers,
  ...eventoHandlers,
  ...usuarioHandlers,
  ...dashboardHandlers,
  ...reembolsoHandlers,
  ...funcionalidadHandlers,
  ...accesoHandlers,
  ...sesionHandlers,
  ...ticketHandlers,
];
