import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { OAuth2SuccessPage } from '../../features/auth/pages/OAuth2SuccessPage';
import { OAuth2ErrorPage } from '../../features/auth/pages/OAuth2ErrorPage';
import { UnlockAccountPage } from '../../features/auth/pages/UnlockAccountPage';
import ProfilePage from '../../features/auth/pages/ProfilePage';
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute';
import { DashboardLayout } from '../../features/dashboard/layout/DashboardLayout';
import GeneralDashboardPage from '../../features/dashboard/pages/GeneralDashboardPage';
import EventosListPage from '../../features/eventos/pages/EventosListPage';
import EventoDetailPage from '../../features/eventos/pages/EventoDetailPage';
import EventosHistorialPage from '../../features/eventos/pages/EventosHistorialPage';
import PortalPage from '../../features/eventos/pages/PortalPage';
import PortalEventoDetailPage from '../../features/eventos/pages/PortalEventoDetailPage';
import MisTicketsPage from '../../features/eventos/pages/MisTicketsPage';
import MisAsignacionesPage from '../../features/eventos/pages/MisAsignacionesPage';
import CheckInPage from '../../features/eventos/pages/CheckInPage';
import FuncionalidadesListPage from '../../features/funcionalidades/pages/FuncionalidadesListPage';
import SesionesListPage from '../../features/sesiones/pages/SesionesListPage';
import AccesosListPage from '../../features/accesos/pages/AccesosListPage';
import AccesoDetailPage from '../../features/accesos/pages/AccesoDetailPage';
import UsuariosListPage from '../../features/usuarios/pages/UsuariosListPage';
import UsuarioDetailPage from '../../features/usuarios/pages/UsuarioDetailPage';
import SolicitudesReembolsoPage from '../../features/reembolsos/pages/SolicitudesReembolsoPage';
import MisReembolsosPage from '../../features/reembolsos/pages/MisReembolsosPage';
import UnauthorizedPage from '../../pages/UnauthorizedPage';
import NotFoundPage from '../../pages/NotFoundPage';
import { RoleGuard } from '../../components/common/RoleGuard';
import { useAuthStore } from '../store/auth.store';
import { ROLES } from '../../config/roles';

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (location.search.includes('authenticated=true')) {
    return <Navigate to={`/oauth2/redirect${location.search}`} replace />;
  }

  if (isAuthenticated) {
    if (user?.roles.includes(ROLES.ADMIN)) {
      return <Navigate to="/dashboard" replace />;
    }
    if (user?.roles.includes(ROLES.ORGANIZER)) {
      return <Navigate to="/dashboard/eventos" replace />;
    }
    return <Navigate to="/dashboard/portal" replace />;
  }

  return <Navigate to="/login" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth2/success" element={<OAuth2SuccessPage />} />
      <Route path="/oauth2/error" element={<OAuth2ErrorPage />} />
      <Route path="/unlock-account" element={<UnlockAccountPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />



      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* Accesibles por todos los roles autenticados (ADMIN, ORGANIZER, USER) */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="portal" element={<PortalPage />} />
          <Route path="portal/eventos/:id" element={<PortalEventoDetailPage />} />
          <Route path="mis-tickets" element={<MisTicketsPage />} />
          <Route path="mis-reembolsos" element={<MisReembolsosPage />} />
          <Route path="asignaciones" element={<MisAsignacionesPage />} />
          <Route path="eventos/:id/checkin" element={<CheckInPage />} />

          {/* Permite a ADMIN y ORGANIZER entrar al resto del dashboard */}
          <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ORGANIZER]} />}>

            {/* Rutas exclusivas de ADMIN */}
            <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
              <Route index element={<GeneralDashboardPage />} />
              {/* Usuarios */}
              <Route path="usuarios" element={<UsuariosListPage />} />
              <Route path="usuarios/:id" element={<UsuarioDetailPage />} />
              {/* Accesos */}
              <Route path="accesos" element={<AccesosListPage />} />
              <Route path="accesos/:id" element={<AccesoDetailPage />} />
              {/* Funcionalidades */}
              <Route path="funcionalidades" element={<FuncionalidadesListPage />} />
              {/* Sesiones */}
              <Route path="sesiones" element={<SesionesListPage />} />
            </Route>

            {/* Eventos */}
            <Route path="eventos" element={<EventosListPage />} />
            <Route path="eventos/historial" element={<EventosHistorialPage />} />
            <Route path="eventos/:id" element={<EventoDetailPage />} />
            <Route path="eventos/:id/reembolsos" element={<SolicitudesReembolsoPage />} />

            {/* Fallback index para ROLE_ORGANIZER: redirige a eventos */}
            <Route element={<RoleGuard allowedRoles={[ROLES.ORGANIZER]} redirectTo="/unauthorized" />}>
              <Route index element={<Navigate to="/dashboard/eventos" replace />} />
            </Route>

          </Route>

        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
