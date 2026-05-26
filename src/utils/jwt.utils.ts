import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub?: string;
  iat?: number;
  exp?: number;
  authorities?: Array<{ authority: string }> | string[] | string;
  roles?: Array<{ authority: string }> | string[] | string;
  scope?: string;
  [key: string]: unknown;
}

/**
 * Extrae y normaliza los roles de un token JWT de Spring Security.
 */
export const extractRoles = (token: string): string[] => {
  if (!token) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Intentar buscar en 'authorities', 'roles' o 'scope'
    const claim = decoded.authorities || decoded.roles || decoded.scope;

    if (!claim) return [];

    // Caso a): Array de strings ["ROLE_ADMIN", "ROLE_USER"]
    if (Array.isArray(claim) && typeof claim[0] === 'string') {
      return claim as string[];
    }

    // Caso b): Array de objetos [{ authority: "ROLE_ADMIN" }]
    if (Array.isArray(claim) && typeof claim[0] === 'object' && claim[0] !== null) {
      return claim
        .filter((item: unknown): item is { authority: string } => 
          typeof item === 'object' && item !== null && 'authority' in item && typeof (item as { authority: string }).authority === 'string'
        )
        .map((item) => item.authority);
    }

    // Caso c): String separado por comas "ROLE_ADMIN,ROLE_USER"
    if (typeof claim === 'string') {
      return claim.split(',').map((r) => r.trim()).filter(Boolean);
    }

    return [];
  } catch (error) {
    return [];
  }
};

/**
 * Extrae el nombre o email del token si está disponible.
 * Si el subject (sub) es un UUID (ID de usuario), devuelve un fallback para no mostrar el ID en la UI.
 */
export const extractSubject = (token: string): string => {
  if (!token) return 'Usuario OAuth';
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    if (decoded.email && typeof decoded.email === 'string') return decoded.email;
    if (decoded.name && typeof decoded.name === 'string') return decoded.name;
    if (decoded.username && typeof decoded.username === 'string') return decoded.username;
    
    // Si el sub existe y NO es un UUID, lo devolvemos
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (decoded.sub && !uuidRegex.test(decoded.sub)) {
      return decoded.sub;
    }
    
    return 'Usuario OAuth';
  } catch (error) {
    return 'Usuario OAuth';
  }
};
