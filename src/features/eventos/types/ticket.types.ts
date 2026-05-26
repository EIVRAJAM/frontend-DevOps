export type EstadoTicket =
  | 'GRATIS'
  | 'PENDIENTE'
  | 'PAGADO'
  | 'CANCELADO'
  | 'REEMBOLSADO';

// Response from POST /tickets/evento/{eventoId}
export interface InscripcionResponse {
  idTicket: number;
  estadoTicket: EstadoTicket;
  codigoQr: string;
  clientSecret: string | null;
  // Legacy compatibility
  ticketId?: number;
  mensaje?: string;
}

// Full ticket DTO returned by GET /tickets/mis-tickets and GET /tickets/{id}
export interface TicketResponseDTO {
  idTicket: number;
  idEvento: number;
  nombreEvento: string;
  idUsuario: number;
  estadoTicket: EstadoTicket;
  montoPagado: number;
  moneda: string | null;
  codigoQr: string;
  fechaCompra: string;
  creadoEn: string;
  checkinRealizado: boolean;
  fechaCheckin: string | null;
}

export interface EventoCanceladoInfo {
  idEvento: number;
  nombreEvento: string;
  estadoEvento: string;
  fechaEvento: string;
  horaEvento: string;
  lugarEvento: string;
}

export interface TicketEventoCanceladoResponse {
  idTicket: number;
  estadoTicket: EstadoTicket;
  evento: EventoCanceladoInfo;
  reembolsoDisponible: boolean;
  estadoReembolso: string;
  mensaje: string;
}

export interface MisEventosCanceladosResponse {
  total: number;
  tickets: TicketEventoCanceladoResponse[];
}
