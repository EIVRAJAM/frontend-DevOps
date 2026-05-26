export interface DashboardStatsResponse {
  totalUsuarios: number;
  usuariosActivos: number;
  totalEventos: number;
  eventosPublicados: number;
  totalTickets: number;
  ticketsVendidosHoy: number;
  totalPagos: number;
  montoTotalPagos: number;
  reembolsosPendientes: number;
  sesionesActivas: number;
  ultimosUsuarios: UltimoUsuarioItem[];
  proximosEventos: ProximoEventoItem[];
}

export interface UltimoUsuarioItem {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  fechaCreacion: string;
}

export interface ProximoEventoItem {
  idEvento: number;
  nombreEvento: string;
  fechaEvento: string;
}

export interface EventoFinanzasResponse {
  eventoId: number;
  nombreEvento: string;
  ticketsVendidos: number;
  ticketsGratis: number;
  ticketsPagados: number;
  ingresosTotales: number;
  reembolsosSolicitados: number;
  montoReembolsosPendientes: number;
  tasaOcupacion: number;
}
