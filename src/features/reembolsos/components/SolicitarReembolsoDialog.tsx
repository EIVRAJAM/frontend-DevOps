import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { solicitarReembolsoSchema, SolicitarReembolsoFormValues } from '../types/reembolso.types';
import { useSolicitarReembolso } from '../hooks/reembolso.queries';
import { Loader2, Upload, FileText } from 'lucide-react';

interface SolicitarReembolsoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  ticketNombre: string;
  montoPagado: number;
  moneda: string;
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
const errorClass = 'text-xs text-red-400 mt-0.5';

export const SolicitarReembolsoDialog: React.FC<SolicitarReembolsoDialogProps> = ({ isOpen, onClose, ticketId, ticketNombre, montoPagado, moneda }) => {
  const { mutate, isPending } = useSolicitarReembolso();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SolicitarReembolsoFormValues>({
    resolver: zodResolver(solicitarReembolsoSchema),
    defaultValues: { medioReembolso: 'CUENTA_BANCARIA', tipoCuenta: 'AHORROS' },
  });

  const medio = watch('medioReembolso');
  const esCuentaBancaria = medio === 'CUENTA_BANCARIA';
  const [certFileName, setCertFileName] = useState<string | null>(null);
  const [docFileName, setDocFileName] = useState<string | null>(null);

  const getNumeroCuentaLabel = () => {
    switch (medio) {
      case 'NEQUI': return 'Número de celular';
      case 'DAVIPLATA': return 'Número de celular';
      default: return 'Número de cuenta o referencia';
    }
  };

  const onSubmit = (values: SolicitarReembolsoFormValues) => {
    mutate({ ticketId, values }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitar Reembolso" size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[65vh] overflow-y-auto pr-1 space-y-3">

        <div className="mb-4 rounded-xl bg-gray-950/50 border border-white/5 p-4">
          <p className="text-sm text-white font-medium">{ticketNombre}</p>
          <p className="text-xs text-gray-400 mt-1">
            Monto pagado:{' '}
            <span className="text-blue-400 font-medium">
              ${montoPagado.toLocaleString()} {moneda}
            </span>
          </p>
        </div>

        <div>
          <label className={labelClass}>Motivo de la solicitud</label>
          <textarea {...register('motivoSolicitud')} className={inputClass} rows={3} placeholder="Explica por qué solicitas el reembolso..." />
          {errors.motivoSolicitud && <p className={errorClass}>{errors.motivoSolicitud.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Medio de reembolso</label>
          <select {...register('medioReembolso')} className={inputClass}>
            <option value="CUENTA_BANCARIA">Cuenta Bancaria</option>
            <option value="NEQUI">Nequi</option>
            <option value="DAVIPLATA">Daviplata</option>
            <option value="OTRO">Otro</option>
          </select>
          {errors.medioReembolso && <p className={errorClass}>{errors.medioReembolso.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Titular de la cuenta</label>
            <input {...register('titularCuenta')} className={inputClass} placeholder="Nombres y apellidos" />
            {errors.titularCuenta && <p className={errorClass}>{errors.titularCuenta.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Documento del titular</label>
            <input {...register('documentoTitular')} className={inputClass} placeholder="CC / NIT" />
            {errors.documentoTitular && <p className={errorClass}>{errors.documentoTitular.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Correo de contacto</label>
            <input {...register('correoContacto')} className={inputClass} placeholder="correo@ejemplo.com" type="email" />
            {errors.correoContacto && <p className={errorClass}>{errors.correoContacto.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Teléfono de contacto</label>
            <input {...register('telefonoContacto')} className={inputClass} placeholder="3001234567" />
            {errors.telefonoContacto && <p className={errorClass}>{errors.telefonoContacto.message}</p>}
          </div>
        </div>

        {esCuentaBancaria ? (
          <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
            <p className="text-xs text-amber-400 font-medium mb-3">Datos requeridos para cuenta bancaria</p>

            <div>
              <label className={labelClass}>Entidad financiera</label>
              <input {...register('entidadFinanciera')} className={inputClass} placeholder="Bancolombia, Davivienda..." />
              {errors.entidadFinanciera && <p className={errorClass}>{errors.entidadFinanciera.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Tipo de cuenta</label>
              <select {...register('tipoCuenta')} className={inputClass}>
                <option value="AHORROS">Ahorros</option>
                <option value="CORRIENTE">Corriente</option>
              </select>
              {errors.tipoCuenta && <p className={errorClass}>{errors.tipoCuenta.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Número de cuenta</label>
              <input {...register('numeroCuenta')} className={inputClass} placeholder="1234567890" />
              {errors.numeroCuenta && <p className={errorClass}>{errors.numeroCuenta.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Certificado bancario <span className="text-gray-500 font-normal ml-1">(PDF, JPG o PNG — máx 5 MB)</span></label>
              <p className="text-[11px] text-gray-500 mb-1.5">Adjunta el certificado de la cuenta emitido por el banco que acredita la titularidad.</p>
              <Controller
                name="certificadoCuenta"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <label className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-5 text-sm text-gray-400 hover:border-indigo-500/30 cursor-pointer transition-colors">
                    <Upload size={16} />
                    {certFileName || 'Seleccionar archivo PDF, JPG o PNG'}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                      onChange={(e) => { onChange(e.target.files); setCertFileName(e.target.files?.[0]?.name || null); }}
                      {...field} value={undefined}
                    />
                  </label>
                )}
              />
              {errors.certificadoCuenta && <p className={errorClass}>{(errors.certificadoCuenta as any)?.message}</p>}
            </div>
          </div>
        ) : (
          <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
            <p className="text-xs text-amber-400 font-medium mb-3">
              Datos para {medio === 'NEQUI' ? 'Nequi' : medio === 'DAVIPLATA' ? 'Daviplata' : 'el medio de reembolso'}
            </p>
            <div>
              <label className={labelClass}>{getNumeroCuentaLabel()}</label>
              <input {...register('numeroCuenta')} className={inputClass} placeholder={medio === 'NEQUI' ? 'Ej. 3001234567' : ''} />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Observaciones (opcional)</label>
          <textarea {...register('observaciones')} className={inputClass} rows={2} placeholder="Información adicional que quieras compartir..." />
          {errors.observaciones && <p className={errorClass}>{errors.observaciones.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Documento de identidad del titular <span className="text-gray-500 font-normal ml-1">(PDF, JPG o PNG — máx 5 MB)</span></label>
          <p className="text-[11px] text-gray-500 mb-1.5">Adjunta el documento de identidad de la persona que realizó el pago.</p>
          <Controller
            name="documentoAdicional"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <label className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-5 text-sm text-gray-400 hover:border-indigo-500/30 cursor-pointer transition-colors">
                <FileText size={16} />
                {docFileName || 'Seleccionar archivo PDF, JPG o PNG'}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={(e) => { onChange(e.target.files); setDocFileName(e.target.files?.[0]?.name || null); }}
                  {...field} value={undefined}
                />
              </label>
            )}
          />
          {errors.documentoAdicional && <p className={errorClass}>{(errors.documentoAdicional as any)?.message}</p>}
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
          <p className="text-xs text-indigo-300">Estos datos serán enviados al organizador para que pueda tramitar el reembolso por fuera de la plataforma.</p>
          <p className="text-xs text-amber-400 mt-2">Verifica que la información sea correcta. Por seguridad, solo se guardará el número de cuenta enmascarado.</p>
        </div>

        <div className="flex gap-3 pt-2 sticky bottom-0 bg-gray-900 pb-2">
          <button type="button" onClick={onClose} className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
