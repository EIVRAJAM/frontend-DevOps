import { http, HttpResponse } from 'msw';

const API = '/api/v1/auth';

export const authHandlers = [
  http.post(`${API}/login`, async ({ request }) => {
    const body = await request.json();
    const { usernameOrEmail, password } = body;

    if (usernameOrEmail === 'fail@test.com') {
      return HttpResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTksImVtYWlsIjoiYWRtaW5AdGVzdC5jb20ifQ.mock',
      username: 'admin',
    });
  }),

  http.post(`${API}/signup`, async ({ request }) => {
    const body = await request.json();
    if (body.correoAcceso === 'exists@test.com') {
      return HttpResponse.json(
        { message: 'El correo ya está registrado' },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      { message: 'Usuario registrado exitosamente', username: body.username },
      { status: 201 }
    );
  }),

  http.post(`${API}/logout`, () => {
    return HttpResponse.json({ message: 'Sesión cerrada' });
  }),

  http.post(`${API}/forgot-password`, async ({ request }) => {
    const body = await request.json();
    if (!body.email) {
      return HttpResponse.json(
        { message: 'El correo es obligatorio' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'Código enviado al correo', success: true });
  }),

  http.post(`${API}/reset-password`, async ({ request }) => {
    const body = await request.json();
    if (body.code === '000000') {
      return HttpResponse.json(
        { message: 'Código inválido' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'Contraseña restablecida', success: true });
  }),

  http.post(`${API}/request-account-unlock`, async ({ request }) => {
    const body = await request.json();
    if (!body.email) {
      return HttpResponse.json(
        { message: 'El correo es obligatorio' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'Código de desbloqueo enviado', success: true });
  }),

  http.post(`${API}/unlock-account`, async ({ request }) => {
    const body = await request.json();
    if (body.code === '000000') {
      return HttpResponse.json(
        { message: 'Código inválido' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'Cuenta desbloqueada', success: true });
  }),
];
