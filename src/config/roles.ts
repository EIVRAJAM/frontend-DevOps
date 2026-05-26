/**
 * Constantes centralizadas de roles del sistema.
 * Usar siempre estas constantes en lugar de strings literales.
 * Actualizar aquí si el backend cambia el nombre de algún rol.
 */
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  ORGANIZER: 'ROLE_ORGANIZER',
  USER: 'ROLE_USER',
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];
