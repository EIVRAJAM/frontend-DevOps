import { http, HttpResponse } from 'msw';

const BASE = '/api/v1/sesiones';

const mockSesion = (id) => ({
  idSesion: id,
  idUsuario: 1,
  nombres: 'Admin',
  apellidos: 'User',
  fechaIngreso: '2025-05-26T10:00:00',
  fechaUltimaActividad: '2025-05-26T11:00:00',
  activa: id % 2 !== 0,
  tokenJti: `jti-${id}`,
});

const MOCK_DATA = Array.from({ length: 5 }, (_, i) => mockSesion(i + 1));

const pageResponse = (content, page = 0, size = 10) => ({
  content,
  totalPages: Math.ceil(content.length / size),
  totalElements: content.length,
  number: page,
  size,
  first: page === 0,
  last: content.length <= (page + 1) * size,
});

export const sesionHandlers = [
  http.get(BASE, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    return HttpResponse.json(pageResponse(MOCK_DATA, page, size));
  }),

  http.get(`${BASE}/activas`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '10');
    const activas = MOCK_DATA.filter((s) => s.activa);
    return HttpResponse.json(pageResponse(activas, page, size));
  }),

  http.get(`${BASE}/ultima`, () => {
    return HttpResponse.json(MOCK_DATA[0]);
  }),

  http.delete(`${BASE}/:id`, () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
