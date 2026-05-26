import { http, HttpResponse } from 'msw';

const BASE = '/api/v1/usuarios';

const mockUsuario = (id) => ({
  idUsuario: id,
  documento: `DOC${id}${id}${id}`,
  nombres: `Nombre${id}`,
  apellidos: `Apellido${id}`,
  genero: id % 2 === 0 ? 'masculino' : 'femenino',
  fechaNacimiento: '1990-01-01',
  telefono: '3001234567',
  estado: 'ACTIVO',
  creadoEn: '2025-01-01T00:00:00',
  actualizadoEn: '2025-01-01T00:00:00',
  roles: id === 1 ? ['ROLE_ADMIN'] : ['ROLE_USER'],
});

const MOCK_USUARIOS = Array.from({ length: 5 }, (_, i) => mockUsuario(i + 1));

const pageResponse = (content, page = 0, size = 10) => ({
  content,
  totalPages: Math.ceil(content.length / size),
  totalElements: content.length,
  number: page,
  size,
  first: page === 0,
  last: content.length <= (page + 1) * size,
});

export const usuarioHandlers = [
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    return HttpResponse.json(pageResponse(MOCK_USUARIOS, page, size));
  }),

  http.get(`${BASE}/all`, () => {
    return HttpResponse.json(MOCK_USUARIOS);
  }),

  http.get(`${BASE}/id`, () => {
    return HttpResponse.json(mockUsuario(1));
  }),

  http.get(`${BASE}/:id`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockUsuario(id));
  }),

  http.get(`${BASE}/document/:doc`, () => {
    return HttpResponse.json(mockUsuario(1));
  }),

  http.post(BASE, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { idUsuario: 99, mensaje: 'Usuario creado exitosamente' },
      { status: 201 }
    );
  }),

  http.put(`${BASE}/:id/admin`, async ({ request, params }) => {
    const id = parseInt(params.id);
    const body = await request.json();
    return HttpResponse.json({ ...mockUsuario(id), ...body });
  }),

  http.patch(`${BASE}/me`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...mockUsuario(1), ...body });
  }),

  http.get(`${BASE}/:id/organizador`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({
      idUsuario: id,
      nombres: `Nombre${id}`,
      apellidos: `Apellido${id}`,
      correo: `user${id}@test.com`,
    });
  }),

  http.patch(`${BASE}/:id/activar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockUsuario(id), estado: 'ACTIVO' });
  }),

  http.patch(`${BASE}/:id/desactivar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockUsuario(id), estado: 'INACTIVO' });
  }),

  http.patch(`${BASE}/:id/bloquear`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockUsuario(id), estado: 'BLOQUEADO' });
  }),

  http.get(`${BASE}/complete-status`, () => {
    return HttpResponse.json({ complete: true, missingFields: [] });
  }),
];
