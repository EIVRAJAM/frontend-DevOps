export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface SesionResponseDto {
  idSesion: number;
  idUsuario: number;
  nombresUsuario: string;
  apellidosUsuario: string;
  fechaInicio: string; // LocalDateTime mapped to ISO string
  fechaFin: string | null;
  activa: boolean;
  tokenJti: string;
}

export interface SesionFilterRequest {
  idUsuario?: number | null;
  fechaInicio?: string;
  fechaFin?: string;
  activa?: boolean;
  page?: number;
  size?: number;
}
