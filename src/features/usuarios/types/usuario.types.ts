// Mirrors UserListResponse.java and SignUpResponseUsuario.java from backend

export interface UsuarioResponse {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  documento: string;
  nombreRol?: string;
  genero?: string;
  telefono?: string;
  fechaNacimiento?: string;
  estado?: string;
}

export interface UsuarioOrganizadorResponse {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  documento: string;
  username: string;
  correo: string;
  telefono: string;
  nombreRol: string;
}

export interface CompleteStatusResponse {
  requiresCompletion: boolean;
  missingFields: string[];
}

export interface UsuarioCreatedResponse {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  telefono: string;
}

// Mirrors SignUpRequest.java (used for creating usuario + acceso in one shot via /auth/signup)
export interface UsuarioCreateRequest {
  documento: string;
  nombres: string;
  apellidos: string;
  genero: 'masculino' | 'femenino';
  fechaNacimiento: string;
  telefono: string;
  nombreRol: string;
}

// Mirrors UpdateUsuarioRequest.java
export interface UsuarioUpdateRequest {
  documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  genero: 'masculino' | 'femenino';
  fechaNacimiento: string; // ISO-8601
  idRol: number;
}

// Mirrors UsuarioFilterRequest.java
export interface UsuarioFilterRequest {
  documento?: string;
  nombres?: string;
  apellidos?: string;
  nombreRol?: string;
  page?: number;
  size?: number;
}

// Generic Spring Page wrapper
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}
