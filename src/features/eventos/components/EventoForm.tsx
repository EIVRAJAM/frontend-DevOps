import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateEventoRequest } from '../types/evento.types';

const schema = z.object({
  nombreEvento: z.string().min(1, 'El nombre es requerido').max(150),
  descripcionEvento: z.string().max(5000).nullable().optional(),
  fechaEvento: z.string().min(1, 'La fecha es requerida'),
  horaEvento: z.string().min(1, 'La hora es requerida'),
  lugarEvento: z.string().min(1, 'El lugar es requerido').max(200),
  referenciaUbicacion: z.string().max(255).nullable().optional(),
  imagenUrl: z.string().max(500).nullable().optional(),
  capacidadMaxima: z.number({ message: 'Requerido' }).min(0, 'No puede ser negativa'),
  tieneParqueadero: z.boolean(),
  cuposParqueadero: z.number().min(0).optional(),
  esDePago: z.boolean().default(false),
  precio: z.number().min(0).optional(),
  moneda: z.enum(['COP', 'USD', 'EUR', 'MXN']).optional(),
}).refine(data => {
  if (data.esDePago) {
    return data.precio !== undefined && data.precio > 0 && !!data.moneda;
  }
  return true;
}, {
  message: "El precio (mayor a 0) y la moneda son obligatorios si el evento es de pago",
  path: ["precio"]
});

type FormValues = z.infer<typeof schema>;

interface EventoFormProps {
  initialData?: any; // Used to populate form for editing
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60 focus:bg-white/[0.07]';
const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';
const errorClass = 'mt-1 text-xs text-red-400';

export const EventoForm: React.FC<EventoFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      nombreEvento: initialData.nombreEvento,
      descripcionEvento: initialData.descripcionEvento || undefined,
      fechaEvento: initialData.fechaEvento ? initialData.fechaEvento.split('T')[0] : '',
      horaEvento: initialData.horaEvento,
      lugarEvento: initialData.lugarEvento,
      referenciaUbicacion: initialData.referenciaUbicacion || undefined,
      imagenUrl: initialData.imagenUrl || undefined,
      capacidadMaxima: initialData.capacidadMaxima,
      tieneParqueadero: initialData.tieneParqueadero,
      cuposParqueadero: initialData.cuposParqueadero || undefined,
      esDePago: initialData.esDePago || false,
      precio: initialData.precio || undefined,
      moneda: initialData.moneda || undefined,
    } : {
      esDePago: false,
    }
  });

  const hasParqueadero = watch('tieneParqueadero');
  const isPaid = watch('esDePago');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <strong>Atención:</strong> Por favor corrige los errores indicados para continuar:<br />
          {Object.entries(errors).map(([key, err]: any) => (
            <span key={key} className="block ml-2">- {key}: {err.message}</span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nombre del Evento</label>
          <input {...register('nombreEvento')} className={inputClass} placeholder="Ej. Conferencia de DevOps 2026" />
          {errors.nombreEvento && <p className={errorClass}>{errors.nombreEvento.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Fecha</label>
          <input type="date" {...register('fechaEvento')} className={inputClass} />
          {errors.fechaEvento && <p className={errorClass}>{errors.fechaEvento.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Hora</label>
          <input type="time" {...register('horaEvento')} className={inputClass} />
          {errors.horaEvento && <p className={errorClass}>{errors.horaEvento.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Lugar</label>
          <input {...register('lugarEvento')} className={inputClass} placeholder="Ej. Auditorio A" />
          {errors.lugarEvento && <p className={errorClass}>{errors.lugarEvento.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Capacidad Máxima</label>
          <input type="number" {...register('capacidadMaxima', { valueAsNumber: true })} className={inputClass} placeholder="0" />
          {errors.capacidadMaxima && <p className={errorClass}>{errors.capacidadMaxima.message}</p>}
        </div>

        <div className="sm:col-span-2 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
          <input type="checkbox" {...register('tieneParqueadero')} className="w-5 h-5 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500/50" />
          <label className="text-sm font-medium text-white">¿El lugar cuenta con parqueadero?</label>
        </div>

        {hasParqueadero && (
          <div className="sm:col-span-2">
            <label className={labelClass}>Cupos de Parqueadero</label>
            <input type="number" {...register('cuposParqueadero', { valueAsNumber: true })} className={inputClass} placeholder="100" />
            {errors.cuposParqueadero && <p className={errorClass}>{errors.cuposParqueadero.message}</p>}
          </div>
        )}

        {/* --- Sección de Pagos --- */}
        <div className="sm:col-span-2 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
          <input type="checkbox" {...register('esDePago')} className="w-5 h-5 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500/50" />
          <label className="text-sm font-medium text-white">¿El evento tiene un costo de inscripción?</label>
        </div>

        {isPaid && (
          <div className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Precio</label>
              <input type="number" step="0.01" {...register('precio', { valueAsNumber: true })} className={inputClass} placeholder="Ej. 50000" />
              {errors.precio && <p className={errorClass}>{errors.precio.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Moneda</label>
              <select {...register('moneda')} className={inputClass}>
                <option value="">Selecciona moneda...</option>
                <option value="COP">COP - Pesos Colombianos</option>
                <option value="USD">USD - Dólares</option>
                <option value="EUR">EUR - Euros</option>
                <option value="MXN">MXN - Pesos Mexicanos</option>
              </select>
              {errors.moneda && <p className={errorClass}>{errors.moneda.message}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Crear Evento')}
        </button>
      </div>
    </form>
  );
};
