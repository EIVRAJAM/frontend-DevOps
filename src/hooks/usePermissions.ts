import { useAuthStore } from '../app/store/auth.store';
import { ROLES } from '../config/roles';

export const usePermissions = () => {
  const { user } = useAuthStore();
  const roles = user?.roles ?? [];

  const isAdmin = roles.includes(ROLES.ADMIN);
  const isOrganizer = roles.includes(ROLES.ORGANIZER);
  const isUser = roles.includes(ROLES.USER);
  const hasRole = (role: string) => roles.includes(role);
  const hasAnyRole = (...requiredRoles: string[]) =>
    requiredRoles.some((r) => roles.includes(r));

  return { isAdmin, isOrganizer, isUser, roles, hasRole, hasAnyRole };
};
