import { http, HttpResponse } from 'msw';

export const dashboardHandlers = [
  http.get('/api/v1/dashboard/stats', () => {
    return HttpResponse.json({
      totalUsuarios: 150,
      usuariosActivos: 120,
      totalEventos: 45,
      eventosPublicados: 30,
      totalTickets: 500,
      ticketsVendidosHoy: 12,
      totalPagos: 350,
      montoTotalPagos: 17500000,
      reembolsosPendientes: 5,
      sesionesActivas: 25,
      ultimosUsuarios: [
        { idUsuario: 1, nombres: 'Juan', apellidos: 'Pérez', fechaCreacion: '2025-05-01T10:00:00' },
        { idUsuario: 2, nombres: 'María', apellidos: 'Gómez', fechaCreacion: '2025-05-02T11:00:00' },
      ],
      proximosEventos: [
        { idEvento: 1, nombreEvento: 'Conferencia Tech', fechaEvento: '2025-06-15' },
        { idEvento: 2, nombreEvento: 'Workshop DevOps', fechaEvento: '2025-06-20' },
      ],
    });
  }),

  http.get('/api/v1/dashboard/eventos/:id/finanzas', ({ params }) => {
    return HttpResponse.json({
      eventoId: parseInt(params.id),
      nombreEvento: `Evento ${params.id}`,
      ticketsVendidos: 80,
      ticketsGratis: 20,
      ticketsPagados: 60,
      ingresosTotales: 3000000,
      reembolsosSolicitados: 3,
      montoReembolsosPendientes: 150000,
      tasaOcupacion: 80.0,
    });
  }),
];
