import { http, HttpResponse } from 'msw';

const BASE = '/api/v1/eventos';

const mockEvento = (id) => ({
  idEvento: id,
  idUsuarioCreador: 1,
  nombreEvento: `Evento ${id}`,
  descripcionEvento: 'Descripción del evento',
  fechaEvento: '2025-06-15',
  horaEvento: '18:00:00',
  lugarEvento: 'Auditorio Principal',
  referenciaUbicacion: '',
  imagenUrl: '',
  estadoEvento: 'BORRADOR',
  capacidadMaxima: 100,
  tieneParqueadero: true,
  cuposParqueadero: 30,
  estado: 'ACTIVO',
  creadoEn: '2025-01-01T00:00:00',
  actualizadoEn: '2025-01-01T00:00:00',
  esDePago: false,
  precio: null,
  moneda: null,
  capacidadDisponible: 100,
});

const MOCK_EVENTOS = Array.from({ length: 5 }, (_, i) => mockEvento(i + 1));

const pageResponse = (content, page = 0, size = 10) => ({
  content,
  totalPages: Math.ceil(content.length / size),
  totalElements: content.length,
  number: page,
  size,
  first: page === 0,
  last: content.length <= (page + 1) * size,
});

const MOCK_STAFF = [
  { idEventoStaff: 1, idEvento: 1, idUsuario: 5, nombreCompleto: 'Staff Uno', estado: 'ACTIVO', asignadoEn: '2025-05-01T10:00:00' },
];

const MOCK_HISTORIAL = [
  { idHistorialEvento: 1, estadoAnterior: null, estadoNuevo: 'BORRADOR', comentario: 'Evento creado', idUsuarioResponsable: 1, nombreUsuarioResponsable: 'Admin', fechaCambio: '2025-01-01T00:00:00' },
];

export const eventoHandlers = [
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    return HttpResponse.json(pageResponse(MOCK_EVENTOS, page, size));
  }),

  http.get(`${BASE}/disponibles`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '20');
    return HttpResponse.json(pageResponse(MOCK_EVENTOS, page, size));
  }),

  http.get(`${BASE}/mis-eventos`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '20');
    return HttpResponse.json(pageResponse(MOCK_EVENTOS, page, size));
  }),

  http.get(`${BASE}/:id`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  http.get(`${BASE}/disponibles/:id`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  http.post(BASE, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(mockEvento(99), { status: 201 });
  }),

  http.put(`${BASE}/:id`, async ({ request, params }) => {
    const id = parseInt(params.id);
    const body = await request.json();
    return HttpResponse.json({ ...mockEvento(id), ...body });
  }),

  http.get('/api/v1/usuarios/:userId/eventos', ({ params, request }) => {
    const userId = parseInt(params.userId);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    return HttpResponse.json(pageResponse(MOCK_EVENTOS, page, size));
  }),

  http.get(`${BASE}/:id/tickets`, ({ params }) => {
    return HttpResponse.json([
      {
        idTicket: 1,
        idEvento: parseInt(params.id),
        nombreEvento: `Evento ${params.id}`,
        idUsuario: 1,
        estadoTicket: 'PAGADO',
        montoPagado: 50000,
        moneda: 'COP',
        codigoQr: 'QR-CODE-123',
        fechaCompra: '2025-01-15',
        creadoEn: '2025-01-15T10:00:00',
        checkinRealizado: false,
        fechaCheckin: null,
      },
    ]);
  }),

  http.get(`${BASE}/:id/historial`, () => {
    return HttpResponse.json(MOCK_HISTORIAL);
  }),

  http.patch(`${BASE}/:id/publicar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  http.patch(`${BASE}/:id/cerrar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  http.patch(`${BASE}/:id/cancelar`, async ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  http.patch(`${BASE}/:id/activar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  http.patch(`${BASE}/:id/desactivar`, async ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockEvento(id));
  }),

  // Staff
  http.post(`${BASE}/:id/staff`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { idEventoStaff: 2, idEvento: parseInt(params.id), idUsuario: body.idUsuario, nombreCompleto: 'Nuevo Staff', estado: 'ACTIVO', asignadoEn: new Date().toISOString() },
      { status: 201 }
    );
  }),

  http.get(`${BASE}/:id/staff`, () => {
    return HttpResponse.json(MOCK_STAFF);
  }),

  http.patch(`${BASE}/:id/staff/:userId/activar`, ({ params }) => {
    return HttpResponse.json({ ...MOCK_STAFF[0], estado: 'ACTIVO' });
  }),

  http.patch(`${BASE}/:id/staff/:userId/desactivar`, ({ params }) => {
    return HttpResponse.json({ ...MOCK_STAFF[0], estado: 'INACTIVO' });
  }),

  http.get(`${BASE}/staff/mis-asignaciones`, () => {
    return HttpResponse.json([
      {
        idEvento: 1,
        nombreEvento: 'Evento Asignado',
        fechaEvento: '2025-06-15',
        horaEvento: '18:00:00',
        lugarEvento: 'Auditorio',
        estadoEvento: 'PUBLICADO',
      },
    ]);
  }),

  http.get(`${BASE}/staff/tiene-asignaciones`, () => {
    return HttpResponse.json(true);
  }),

  // Check-in
  http.post(`${BASE}/:id/check-in`, async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({
      idTicket: 1,
      idEvento: parseInt(params.id),
      nombreEvento: `Evento ${params.id}`,
      nombreAsistente: 'Usuario Test',
      estadoTicket: 'PAGADO',
      checkinRealizado: true,
      fechaCheckin: new Date().toISOString(),
    });
  }),

  http.get(`${BASE}/:id/check-in/resumen`, ({ params }) => {
    return HttpResponse.json({
      totalInscritos: 50,
      totalIngresados: 30,
      totalPendientes: 20,
      porcentajeIngreso: 60.0,
    });
  }),

  http.get(`${BASE}/:id/check-in/estado`, ({ params }) => {
    return HttpResponse.json({
      habilitado: true,
      motivo: '',
      eventoId: parseInt(params.id),
      nombreEvento: `Evento ${params.id}`,
      estadoEvento: 'PUBLICADO',
      estado: 'ACTIVO',
      fechaEvento: '2025-06-15',
      horaEvento: '18:00:00',
      aperturaCheckin: '2025-06-15T16:00:00',
      ahora: new Date().toISOString(),
    });
  }),
];
