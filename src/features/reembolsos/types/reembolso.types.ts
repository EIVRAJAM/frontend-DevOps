import { z } from 'zod';

export type EstadoSolicitudReembolso =
  | 'SOLICITADA'
  | 'EN_REVISION'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'PROCESADA'
  | 'FALLIDA'
  | 'CANCELADA'
  | 'REEMBOLSADA';

export type MedioReembolso = 'CUENTA_BANCARIA' | 'NEQUI' | 'DAVIPLATA' | 'OTRO';
export type TipoCuentaReembolso = 'AHORROS' | 'CORRIENTE';

export interface DatosReembolsoResponse {
  medioReembolso: string;
  titularCuenta: string;
  documentoTitular: string;
  entidadFinanciera: string | null;
  tipoCuenta: string | null;
  numeroCuentaEnmascarado: string | null;
  correoContacto: string;
  telefonoContacto: string;
  observaciones: string | null;
}

export interface SolicitudReembolsoResponse {
  idSolicitud: number;
  idTicket: number;
  idEvento: number;
  idUsuarioSolicitante: number;
  estado: EstadoSolicitudReembolso;
  motivo: string;
  respuestaOrganizador: string | null;
  montoSolicitado: number;
  montoAprobado: number | null;
  fechaSolicitud: string;
  fechaRevision: string | null;
  fechaProcesamiento: string | null;
  datosReembolso: DatosReembolsoResponse | null;
}

export interface AprobarReembolsoRequest {
  comentario?: string;
}

export interface RechazarReembolsoRequest {
  comentario: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const fileSchema = z
  .instanceof(FileList)
  .optional()
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return files[0]?.size <= MAX_FILE_SIZE;
  }, 'El archivo no puede superar los 5 MB')
  .refine((files) => {
    if (!files || files.length === 0) return true;
    return ACCEPTED_TYPES.includes(files[0]?.type);
  }, 'Solo se permiten archivos PDF, JPG o PNG');

export const solicitarReembolsoSchema = z.object({
  motivoSolicitud: z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
  medioReembolso: z.enum(['CUENTA_BANCARIA', 'NEQUI', 'DAVIPLATA', 'OTRO']),
  titularCuenta: z.string().min(1, 'Requerido').max(150, 'Máximo 150 caracteres'),
  documentoTitular: z.string().min(1, 'Requerido').max(20, 'Máximo 20 caracteres'),
  entidadFinanciera: z.string().optional(),
  tipoCuenta: z.enum(['AHORROS', 'CORRIENTE']).optional(),
  numeroCuenta: z.string().optional(),
  correoContacto: z.string().min(1, 'Requerido').email('Correo inválido'),
  telefonoContacto: z.string().min(1, 'Requerido').max(30, 'Máximo 30 caracteres'),
  observaciones: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  certificadoCuenta: fileSchema,
  documentoAdicional: fileSchema,
}).superRefine((values, ctx) => {
  if (values.medioReembolso !== 'CUENTA_BANCARIA') return;
  if (!values.entidadFinanciera || values.entidadFinanciera.trim() === '') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['entidadFinanciera'], message: 'Requerido para cuenta bancaria' });
  }
  if (!values.tipoCuenta) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tipoCuenta'], message: 'Requerido para cuenta bancaria' });
  }
  if (!values.numeroCuenta || values.numeroCuenta.trim() === '') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['numeroCuenta'], message: 'Requerido para cuenta bancaria' });
  }
  if (!values.certificadoCuenta || values.certificadoCuenta.length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['certificadoCuenta'], message: 'Requerido para cuenta bancaria' });
  }
});

export type SolicitarReembolsoFormValues = z.infer<typeof solicitarReembolsoSchema>;
