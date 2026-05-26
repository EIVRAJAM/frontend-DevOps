import { http, HttpResponse } from 'msw';

const BASE = '/api/v1/accesos';

const mockAcceso = (idUsuario) => ({
  idAcceso: idUsuario,
  idUsuario: idUsuario,
  username: `user${idUsuario}`,
  correoAcceso: `user${idUsuario}@test.com`,
  activo: true,
  bloqueado: false,
  creadoEn: '2025-01-01T00:00:00',
  actualizadoEn: '2025-01-01T00:00:00',
});

const MOCK_DATA = Array.from({ length: 3 }, (_, i) => mockAcceso(i + 1));

export const accesoHandlers = [
  http.get(BASE, () => {
    return HttpResponse.json(MOCK_DATA);
  }),

  http.get(`${BASE}/:idUsuario`, ({ params }) => {
    const id = parseInt(params.idUsuario);
    return HttpResponse.json(mockAcceso(id));
  }),

  http.post(BASE, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { ...mockAcceso(body.idUsuario), ...body },
      { status: 201 }
    );
  }),

  http.put(`${BASE}/:idUsuario`, async ({ request, params }) => {
    const id = parseInt(params.idUsuario);
    const body = await request.json();
    return HttpResponse.json({ ...mockAcceso(id), ...body });
  }),

  http.patch(`${BASE}/:idUsuario/activar`, ({ params }) => {
    const id = parseInt(params.idUsuario);
    return HttpResponse.json({ ...mockAcceso(id), activo: true });
  }),

  http.patch(`${BASE}/:idUsuario/desactivar`, ({ params }) => {
    const id = parseInt(params.idUsuario);
    return HttpResponse.json({ ...mockAcceso(id), activo: false });
  }),

  http.patch(`${BASE}/:idUsuario/bloquear`, ({ params }) => {
    const id = parseInt(params.idUsuario);
    return HttpResponse.json({ ...mockAcceso(id), bloqueado: true });
  }),

  http.patch(`${BASE}/cambiar-password`, async ({ request }) => {
    return HttpResponse.json({ message: 'Contraseña actualizada' });
  }),

  http.patch(`${BASE}/:idUsuario/cambiar-password-admin`, async ({ request }) => {
    return HttpResponse.json({ message: 'Contraseña actualizada por admin' });
  }),
];
