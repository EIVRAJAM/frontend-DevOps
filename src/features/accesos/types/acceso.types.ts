export interface AccesoAdminResponse {
  idUsuario: number;
  username: string;
  correoAcceso: string;
  intentosFallidos: number;
  estadoCuenta: 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA' | string;
  uuidAcceso: string;
  ultimoLogin: string | null;
  creadoEn: string;
  actualizadoEn: string;
  rol?: string;
}

export interface AccesoUserResponse {
  username: string;
  correoAcceso: string;
}

export interface CreateAccesoAdminRequest {
  idUsuario: number;
  username: string;
  correoAcceso: string;
}

export interface UpdateAccesoRequest {
  username: string;
  correoAcceso: string;
}

export interface UpdatePasswordAdminRequest {
  passwordNueva: string;
}

export interface UpdatePasswordUserRequest {
  passwordActual: string;
  passwordNueva: string;
}
