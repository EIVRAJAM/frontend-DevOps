export interface FuncionalidadResponse {
  idFuncionalidad: number;
  nombreFuncionalidad: string;
  urlFuncionalidad: string | null;
  estado: 'ACTIVA' | 'INACTIVA' | string;
  idPadre: number | null;
}

export interface FuncionalidadRequest {
  nombreFuncionalidad: string;
  urlFuncionalidad?: string;
  idPadre?: number | null;
}

export interface FuncionalidadUpdateRequest {
  nombreFuncionalidad: string;
  urlFuncionalidad?: string;
  estado: 'ACTIVA' | 'INACTIVA' | string;
  idPadre?: number | null;
}

export interface FuncionalidadFilterRequest {
  status?: string;
  id_padre?: number | null;
}
