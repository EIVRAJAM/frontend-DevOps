# System Analysis

## Utils

- **jwt.utils.ts** (`extractRoles`, `extractSubject`):
  - `extractRoles(token: string): string[]` — Decodes a JWT and extracts roles from `authorities`, `roles`, or `scope` claims. Handles three formats: array of strings, array of `{authority}` objects, and comma-separated string. Returns `[]` for empty/invalid tokens.
  - `extractSubject(token: string): string` — Decodes JWT, returns `email`, `name`, `username`, or `sub` (if not a UUID). Falls back to `'Usuario OAuth'`.
  - What to test: happy path with each claim format, empty token, invalid token, expired token, UUID sub, missing email/name/username.
- **lib/utils.ts** (`cn`):
  - `cn(...inputs)` — Merges class names via `clsx` + `tailwind-merge`. Small wrapper.
  - What to test: basic string merge, conditional classes, conflicting Tailwind classes resolve correctly.

## Hooks

- **usePermissions**:
  - Reads `user.roles` from `useAuthStore`, returns `{ isAdmin, isOrganizer, isUser, roles, hasRole(role), hasAnyRole(...roles) }`.
  - What to test: returns correct booleans based on store state, `hasRole` returns true/false, `hasAnyRole` returns true if any match.
- **useStaffAssignments**:
  - Async hook that calls `eventoService.tieneAsignacionesStaff()` on mount and returns boolean. Catches errors silently to false.
  - What to test: returns false initially, resolves to true/false based on service mock, handles error gracefully.

## Store

- **auth.store.ts** (`useAuthStore`):
  - State: `token: string | null`, `user: User | null`, `isAuthenticated: boolean`.
  - Actions: `setCredentials(token, userData)` extracts roles from JWT and sets authenticated state; `clearCredentials()` resets to initial state.
  - Persisted under `auth-storage` key in localStorage.
  - What to test: initial state is unauthenticated, `setCredentials` updates token/user/isAuthenticated and extracts roles, `clearCredentials` resets everything. Verify localStorage persistence behavior.

## Features

### auth (priority: CRITICAL)

- API calls: `authService.login(LoginRequest)`, `authService.register(SignUpRequest)`, `authService.logout()`, `authService.requestPasswordReset(email)`, `authService.resetPassword(ResetPasswordRequest)`, `authService.requestAccountUnlock(RequestUnlockRequest)`, `authService.unlockAccount(UnlockAccountRequest)`.
- Queries/Mutations:
  - `useLogin()` → `{ loginUser, isLoading, error }` — manages login flow, sets credentials on success, navigates to `/`.
  - `useLogout()` → `{ logout }` — calls logout API, clears credentials, navigates to `/login`.
  - `useRegister()` → `{ registerUser, isLoading, error, isSuccess }` — registers user, shows success overlay, delays redirect.
  - `useForgotPassword()` → `{ requestReset, isLoading, isSuccess, error }` — wraps `useRequestPasswordReset` mutation.
  - `useRequestPasswordReset()` — `useMutation` calling `authService.requestPasswordReset`.
  - `useResetPassword()` — `useMutation` calling `authService.resetPassword`.
  - `useRequestAccountUnlock()` — `useMutation` calling `authService.requestAccountUnlock`.
  - `useUnlockAccount()` — `useMutation` calling `authService.unlockAccount`.
- Forms + Zod schemas:
  - `loginSchema`: `usernameOrEmail` (min 1), `password` (min 1).
  - `registerSchema`: 9 fields with validations (genero enum, fechaNacimiento past date, correoAcceso email, claveAcceso min 8).
  - `forgotPasswordSchema`: `correoAcceso` (email).
  - `resetPasswordSchema`: `email` (email), `code` (6 digits), `newPassword` (min 8), `confirmPassword` + refine for match.
  - `requestUnlockSchema`: `email` (email).
  - `unlockAccountSchema`: `email`, `code` (6 digits), `newPassword` (min 8), `confirmPassword` + refine for match.
- Pages: LoginPage, RegisterPage, ProfilePage, ForgotPasswordPage, ResetPasswordPage, UnlockAccountPage, OAuth2SuccessPage, OAuth2ErrorPage.
- Components: LoginForm, RegisterForm, ProtectedRoute, ChangePasswordForm.
- What to test:
  - Login: renders email and password fields, submitting valid credentials calls API and redirects, error message displays on failure.
  - Register: renders all 9 fields, Zod validation errors appear inline, success overlay appears, redirect after delay.
  - ProtectedRoute: redirects to `/login` when not authenticated, renders `<Outlet />` when authenticated.
  - Password reset: forgot password form submits email, reset form validates code length and password match.
  - Logout: clears store, navigates to `/login`.

### dashboard

- API calls: `dashboardService.getStats()`, `dashboardService.getFinanzasByEvento(eventoId)`.
- Components: Sidebar (with NavMenu filtering by role), SidebarItem, DashboardLayout.
- Pages: GeneralDashboardPage (stat cards, recent users, upcoming events).
- What to test:
  - Sidebar: renders correct menu items per role (admin sees all, organizer sees limited, user sees minimal).
  - Sidebar: staff assignments dynamic item appears when `useStaffAssignments` returns true.
  - Sidebar: logout button calls logout function.
  - GeneralDashboardPage: renders stat cards with mock data, shows loading state.

### eventos

- API calls: `eventoService.getAll`, `getDisponibles`, `getMisEventos`, `getById`, `getDisponibleById`, `create`, `update`, `getByUser`, `getTicketsEvento`, `getHistorial`, `publicar`, `cerrar`, `cancelar`, `activar`, `desactivar`, `assignStaff`, `getStaff`, `activarStaff`, `desactivarStaff`, `getMisAsignacionesStaff`, `tieneAsignacionesStaff`, `checkIn`, `getCheckInResumen`, `getCheckInEstado`.
- Tickets: `ticketService.inscribirse`, `getMisTickets`, `getById`, `cancelar`, `getQrImageUrl`, `getMisEventosCancelados`.
- Queries/Mutations: `useEventos()` (list with pagination), `useEvento()` (detail/edit), `useInscribirEvento()`, `useMisTickets()`, `useTicket()`, `useCancelarTicket()`, `useMisEventosCancelados()`, `usePagosPorEvento()`.
- Forms + Zod schemas: `EventoForm` (create/edit evento with zod validation — name, date, time, location, capacity, parking, payment).
- Pages: EventosListPage, EventoDetailPage, EventosHistorialPage, PortalPage, PortalEventoDetailPage, MisTicketsPage, MisAsignacionesPage, CheckInPage.
- Components: EventoForm, EventoPublicoCard, QRScanner, StripeCheckoutDialog, EventoStaffTab, EventoPagosTab, EventoReembolsosTab.
- What to test:
  - List: renders events from MSW mock, pagination works, filters update query params.
  - Create: form renders, field validation errors inline, successful submit calls POST.
  - Edit: pre-fills form with event data, submit calls PUT/PATCH.
  - Status actions: publish/close/cancel buttons call correct endpoints.
  - Tickets: inscription flow, cancel ticket, QR modal display.
  - Staff: assign/dismiss staff, check-in flow with QR scanner.

### reembolsos

- API calls: `reembolsoService.solicitarReembolso` (multipart/form-data), `getMisSolicitudes`, `cancelarSolicitud`, `getReembolsosPorEvento`, `revisarSolicitud`, `aprobarSolicitud`, `rechazarSolicitud`, `marcarReembolsada`.
- Queries/Mutations: `useMisSolicitudes()`, `useSolicitarReembolso()`, `useCancelarSolicitud()`, `useReembolsosPorEvento()`, `useRevisarSolicitud()`, `useAprobarSolicitud()`, `useRechazarSolicitud()`, `useMarcarReembolsada()`.
- Forms + Zod schemas: `solicitarReembolsoSchema` — motivo (10-500 chars), medio, titular, documento, conditional banking fields (entidad, tipoCuenta, numeroCuenta, certificadoCuenta) when `CUENTA_BANCARIA`, correo (email), telefono, observaciones, file uploads (PDF/JPG/PNG, max 5MB).
- Pages: SolicitudesReembolsoPage, MisReembolsosPage.
- Components: ReembolsoStatusBadge, SolicitarReembolsoDialog.
- What to test:
  - List: renders refund requests from mock.
  - Create: form renders with conditional banking fields, file validation, submit with FormData.
  - Actions: approve/reject buttons call correct endpoints.
  - Status display: badge shows correct icon and style per state.

### funcionalidades

- API calls: `funcionalidadService.getAll`, `getById`, `create`, `update`, `activar`, `desactivar`.
- Pages: FuncionalidadesListPage (DataTable, create modal, status toggle).
- Components: FuncionalidadForm, FuncionalidadDetailModal.
- What to test:
  - List: renders from mock, create/create-modal opens form, status toggle calls PATCH.
  - Create: form validates nombre required, submit calls POST.
  - Edit: pre-fills form, submit calls PUT.

### accesos

- API calls: `accesoService.getAll`, `getByIdUsuario`, `create`, `update`, `activar`, `desactivar`, `bloquear`, `cambiarPassword`, `cambiarPasswordAdmin`.
- Pages: AccesosListPage (DataTable, create modal, status toggles), AccesoDetailPage.
- Components: CreateAccesoForm, AccesoDetailModal.
- What to test:
  - List: renders access records, create modal, status toggle buttons.
  - Create: form renders, submit calls POST.
  - Password change: renders password fields, submit calls correct endpoint.

### sesiones

- API calls: `sesionService.getAll`, `getActivas`, `getUltima`, `deleteSesion`.
- Pages: SesionesListPage (DataTable, filters, pagination, detail modal).
- Components: SesionDetailModal (force disconnect via DELETE).
- What to test:
  - List: renders sessions with pagination, filter by active/closed, filter by userId.
  - Force disconnect: modal confirms, calls DELETE, refreshes list.

### usuarios

- API calls: `usuarioService.getAll`, `getAllNoPage`, `getById`, `getByDocument`, `create`, `updateAdmin`, `getCurrentUser`, `getByIdOrganizador`, `updateSelf`, `activar`, `desactivar`, `bloquear`, `getCompleteStatus`.
- Pages: UsuariosListPage (DataTable, create modal, search, status toggles), UsuarioDetailPage (edit, status toggle).
- Components: UsuarioForm (two-step wizard: create user, create access), UpdateUsuarioForm.
- What to test:
  - List: renders users with search, pagination, status toggle.
  - Create: two-step wizard creates user then access credentials.
  - Edit: pre-fills user data, role selection from API, submit calls PUT.
  - Detail: shows user info, can toggle status.

## Components

### Common

- **UsuarioCell** ({ userId: number }):
  - Fetches user name/email on mount via `usuarioService.getByIdOrganizador(userId)`. Shows spinner while loading, fallback `#{userId}` on error.
  - What to test: renders loading spinner initially, renders user name/email on success, renders fallback on error, cleanup on unmount.
- **RoleGuard** ({ allowedRoles, redirectTo?, children? }):
  - Checks auth store. Redirects to `/login` if not authenticated, to `redirectTo` if role mismatch, renders children/Outlet if authorized.
  - What to test: unauthorized redirects to `/login`, wrong role redirects to `/unauthorized`, correct role renders children, renders `<Outlet />` when no children.

### Feedback

- Empty directory — no feedback components exist yet.

### Layout

- **Sidebar / SidebarItem** (in `features/dashboard/components/`):
  - Collapsible sidebar with role-filtered menu items, logout button, staff assignments dynamic item.
  - Uses `useAuthStore`, `useLogout`, `useStaffAssignments`.
  - What to test: expand/collapse toggle, correct nav items per role, staff item when applicable, logout button calls logout, active state on current route.
- **DashboardLayout** (in `features/dashboard/layout/`):
  - Shell with Sidebar + `<Outlet />` for main content.
  - What to test: renders sidebar and content area slot.

## Pages

- **NotFoundPage**: 404 page with "Regresar" button calling `navigate(-1)`. What to test: renders 404 text, renders button, click calls navigate.
- **UnauthorizedPage**: 403 page with AlertCircle icon, button navigates to `/login`. What to test: renders 403 message, icon visible, button navigates to login.

## Test priority order

1. **auth** — login/logout/register flows, ProtectedRoute guard (critical security + core UX)
2. **Store** — auth.store.ts (state management foundation, everything depends on it)
3. **Utils** — jwt.utils.ts (pure functions, easy to test, auth depends on them)
4. **Hooks** — usePermissions (core access control), useStaffAssignments
5. **Common components** — RoleGuard, UsuarioCell
6. **Layout** — Sidebar (role-based visibility)
7. **Pages** — NotFoundPage, UnauthorizedPage
8. **eventos** — largest feature, tickets and events CRUD
9. **usuarios** — user management CRUD
10. **dashboard** — GeneralDashboardPage stats
11. **reembolsos** — refund flows
12. **accesos** — access credential management
13. **sesiones** — session management
14. **funcionalidades** — features CRUD
