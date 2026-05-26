import { http, HttpResponse } from 'msw';

const mockSolicitud = (id, eventId = 1) => ({
  idSolicitud: id,
  idTicket: id * 10,
  idEvento: eventId,
  idUsuarioSolicitante: 2,
  estado: 'SOLICITADA',
  motivo: 'No puedo asistir al evento',
  respuestaOrganizador: null,
  montoSolicitado: 50000,
  montoAprobado: null,
  fechaSolicitud: '2025-05-01T10:00:00',
  fechaRevision: null,
  fechaProcesamiento: null,
  datosReembolso: {
    medioReembolso: 'NEQUI',
    titularCuenta: 'Usuario Test',
    documentoTitular: '123456789',
    entidadFinanciera: null,
    tipoCuenta: null,
    numeroCuentaEnmascarado: '****1234',
    correoContacto: 'test@test.com',
    telefonoContacto: '3001234567',
    observaciones: null,
  },
});

const solicitudes = [mockSolicitud(1, 1), mockSolicitud(2, 2)];

export const reembolsoHandlers = [
  http.post('/api/v1/tickets/:ticketId/reembolso', async ({ params }) => {
    const ticketId = parseInt(params.ticketId);
    return HttpResponse.json(
      mockSolicitud(99, ticketId),
      { status: 201 }
    );
  }),

  http.get('/api/v1/reembolsos/mis-solicitudes', () => {
    return HttpResponse.json(solicitudes);
  }),

  http.patch('/api/v1/reembolsos/:id/cancelar', ({ params }) => {
    return HttpResponse.json(null, { status: 200 });
  }),

  http.get('/api/v1/eventos/:eventoId/reembolsos', ({ params }) => {
    const eventId = parseInt(params.eventoId);
    return HttpResponse.json([mockSolicitud(1, eventId)]);
  }),

  http.patch('/api/v1/eventos/:eventoId/reembolsos/:id/revisar', ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockSolicitud(id), estado: 'EN_REVISION' });
  }),

  http.patch('/api/v1/eventos/:eventoId/reembolsos/:id/aprobar', async ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockSolicitud(id), estado: 'APROBADA' });
  }),

  http.patch('/api/v1/eventos/:eventoId/reembolsos/:id/rechazar', async ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockSolicitud(id), estado: 'RECHAZADA' });
  }),

  http.patch('/api/v1/eventos/:eventoId/reembolsos/:id/marcar-reembolsado', ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockSolicitud(id), estado: 'REEMBOLSADA' });
  }),
];
