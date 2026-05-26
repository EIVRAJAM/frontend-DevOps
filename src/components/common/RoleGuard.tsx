import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth.store';

export interface RoleGuardProps {
  allowedRoles: string[];
  redirectTo?: string;
  children?: ReactNode;
}

export const RoleGuard = ({ 
  allowedRoles, 
  redirectTo = '/unauthorized', 
  children 
}: RoleGuardProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user?.roles || [];
  
  const hasAllowedRole = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAllowedRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
