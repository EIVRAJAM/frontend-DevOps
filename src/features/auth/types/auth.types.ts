export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export type Genero = 'masculino' | 'femenino';

export interface SignUpRequest {
  documento: string;
  nombres: string;
  apellidos: string;
  genero: Genero;
  fechaNacimiento: string;
  telefono: string;
  username: string;
  correoAcceso: string;
  claveAcceso: string;
}

export interface User {
  username: string;
  email?: string;
  roles: string[];
}

export interface AuthResponse {
  token?: string;
  message?: string;
  username?: string;
}
