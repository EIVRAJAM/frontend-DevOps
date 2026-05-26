import { http, HttpResponse } from 'msw';

const BASE = '/api/v1/tickets';

const mockTicket = (id, eventId = 1) => ({
  idTicket: id,
  idEvento: eventId,
  nombreEvento: `Evento ${eventId}`,
  idUsuario: 1,
  estadoTicket: 'PAGADO',
  montoPagado: 50000,
  moneda: 'COP',
  codigoQr: `QR-CODE-${id}`,
  fechaCompra: '2025-01-15',
  creadoEn: '2025-01-15T10:00:00',
  checkinRealizado: false,
  fechaCheckin: null,
});

export const ticketHandlers = [
  http.post(`${BASE}/evento/:eventoId`, ({ params }) => {
    return HttpResponse.json({
      idTicket: 10,
      estadoTicket: 'GRATIS',
      codigoQr: 'QR-CODE-NEW',
      clientSecret: null,
    }, { status: 201 });
  }),

  http.get(`${BASE}/mis-tickets`, () => {
    return HttpResponse.json([mockTicket(1, 1), mockTicket(2, 2)]);
  }),

  http.get(`${BASE}/:id`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockTicket(id));
  }),

  http.post(`${BASE}/:id/cancelar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockTicket(id), estadoTicket: 'CANCELADO' });
  }),

  http.get(`${BASE}/:id/qr`, ({ params }) => {
    return new HttpResponse(new Blob(), {
      headers: { 'Content-Type': 'image/png' },
    });
  }),

  http.get(`${BASE}/mis-eventos-cancelados`, () => {
    return HttpResponse.json({
      total: 0,
      tickets: [],
    });
  }),
];
