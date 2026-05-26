# Reporte de Pruebas - Frontend DevOps

**Fecha:** 26 de Mayo 2026  
**Resultado:** ✅ Todos los tests pasan  
**Total:** 140 pruebas | 18 archivos de test

---

## Resumen General

| Categoria | Archivos | Pruebas | Estado |
|-----------|----------|---------|--------|
| Utilidades | 1 | 19 | ✅ |
| Hooks | 2 | 13 | ✅ |
| Store (Zustand) | 1 | 8 | ✅ |
| Componentes Comunes | 2 | 11 | ✅ |
| Componentes Layout | 3 | 18 | ✅ |
| Feature: Auth | 3 | 16 | ✅ |
| Schemas Zod | 2 | 19 | ✅ |
| Feature: Eventos | 2 | 18 | ✅ |
| Feature: Usuarios | 1 | 8 | ✅ |
| Feature: Reembolsos | 1 | 10 | ✅ |

---

## Cobertura de Código

| Metrica | Porcentaje |
|---------|------------|
| Sentencias (Statements) | 75.46% |
| Ramas (Branches) | 68.59% |
| Funciones | 62.5% |
| Lineas | 75.57% |

### Archivos con mejor cobertura

| Archivo | Cobertura |
|---------|-----------|
| `jwt.utils.ts` | 96.4% |
| `LoginForm.tsx` | 100% |
| `RoleGuard.tsx` | 100% |
| `UsuarioCell.tsx` | 100% |
| `auth.schema.ts` | 90.9% |
| `Sidebar.tsx` | 82.1% |

---

## Que se Prueba

### Autenticacion (CRITICO)

- Login con credenciales validas e invalidas
- Redireccion tras login exitoso
- Validaciones de formulario (campos vacios, email, password minimo)
- Proteccion de rutas: redireccion a `/login` si no hay sesion
- Logout: limpia credenciales y redirige
- Recuperacion de contrasena y desbloqueo de cuenta (schemas Zod)

### Store de Autenticacion

- Estado inicial: token, user, isAuthenticated
- `setCredentials`: guarda token, extrae roles del JWT
- `clearCredentials`: resetea todo a null/false
- Persistencia en localStorage

### Hooks Personalizados

- `usePermissions`: detecta roles ADMIN, ORGANIZER, USER correctamente
- `hasRole` y `hasAnyRole`: verificacion puntual de permisos
- `useStaffAssignments`: detecta asignaciones de staff asincronamente

### Utilidades JWT

- Extraccion de roles desde `authorities` (array de strings, objetos, scope)
- Extraccion de subject (email, name, username, sub UUID)
- Manejo de tokens invalidos, vacios, nulos

### Componentes de UI

- `RoleGuard`: redirecciona segun rol del usuario
- `UsuarioCell`: carga nombre/email o muestra fallback `#ID`
- `Sidebar`: muestra items segun rol (admin ve todo, user ve solo lo suyo)
- `NotFoundPage` (404) y `UnauthorizedPage` (403): renderizan y navegan correcto

### Capa de Servicios

- `eventoService`: CRUD eventos, staff, check-in, publicar/cancelar
- `ticketService`: inscripcion, mis tickets, cancelar
- `usuarioService`: CRUD usuarios, activar/desactivar/bloquear
- `reembolsoService`: solicitar, cancelar, aprobar, rechazar reembolsos

### Validaciones Zod

- `loginSchema`: campos requeridos
- `registerSchema`: 9 campos con reglas (genero, fecha pasada, email, password 8+)
- `resetPasswordSchema`: codigo 6 digitos, passwords coinciden
- `unlockAccountSchema`: codigo 6 digitos, passwords coinciden
- `solicitarReembolsoSchema`: motivo 10-500 chars, campos bancarios condicionales

---

## Estructura de los Tests

```
tests/
├── REPORTE_TEST.md          ← Este archivo
├── ANALYSIS.md               ← Analisis del sistema
├── setup/                    ← Configuracion compartida
│   ├── setupTests.js         ← jest-dom matchers + localStorage mock
│   ├── queryWrapper.jsx      ← QueryClient fresco por test
│   └── server.js             ← MSW (listo para tests de integracion)
├── mocks/                    ← Handlers MSW y fixtures JSON
│   ├── handlers/             ← Un archivo por feature
│   └── fixtures/             ← Respuestas de ejemplo
├── unit/                     ← Tests unitarios puros
│   ├── utils/                ← jwt.utils (19 tests)
│   ├── hooks/                ← usePermissions, useStaffAssignments (13)
│   └── store/                ← auth.store (8 tests)
├── components/               ← Tests de renderizado e interaccion
│   ├── common/               ← RoleGuard, UsuarioCell (11 tests)
│   └── layout/               ← Sidebar, NotFound, Unauthorized (18 tests)
└── features/                 ← Tests de feature por dominio
    ├── auth/                 ← Login, logout, ProtectedRoute, Zod (35 tests)
    ├── eventos/              ← EventoService, TicketService (18 tests)
    ├── usuarios/             ← UsuarioService (8 tests)
    └── reembolsos/           ← ReembolsoService, Zod schema (10 tests)
```

---

## Comandos Disponibles

```bash
npm test              # Ejecuta todos los tests
npm run test:watch    # Modo observador (recarga al guardar)
npm run test:coverage # Ejecuta tests con reporte de cobertura
```

---

## Convenciones Usadas

- **Renderizado:** `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
- **Eventos:** `userEvent` (nunca `fireEvent`)
- **Mocks:** Solo se mockea lo que cruza una frontera (HTTP, browser APIs, store)
- **Estado:** Se resetea en `beforeEach` con `vi.clearAllMocks()`
- **Idioma:** Comentarios y descripciones en ingles, reporte en espanol
