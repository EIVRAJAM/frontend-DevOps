import { http, HttpResponse } from 'msw';

const BASE = '/api/v1/funcionalidad';

const mockFuncionalidad = (id) => ({
  idFuncionalidad: id,
  nombre: `Funcionalidad ${id}`,
  url: `/funcionalidad-${id}`,
  status: id % 2 === 0 ? 'ACTIVO' : 'INACTIVO',
  idPadre: null,
  order: id,
});

const MOCK_DATA = Array.from({ length: 4 }, (_, i) => mockFuncionalidad(i + 1));

export const funcionalidadHandlers = [
  http.get(BASE, () => {
    return HttpResponse.json(MOCK_DATA);
  }),

  http.get(`${BASE}/:id`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(mockFuncionalidad(id));
  }),

  http.post(BASE, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { idFuncionalidad: 99, ...body },
      { status: 201 }
    );
  }),

  http.put(`${BASE}/:id`, async ({ request, params }) => {
    const id = parseInt(params.id);
    const body = await request.json();
    return HttpResponse.json({ ...mockFuncionalidad(id), ...body });
  }),

  http.patch(`${BASE}/:id/activar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockFuncionalidad(id), status: 'ACTIVO' });
  }),

  http.patch(`${BASE}/:id/desactivar`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({ ...mockFuncionalidad(id), status: 'INACTIVO' });
  }),
];
