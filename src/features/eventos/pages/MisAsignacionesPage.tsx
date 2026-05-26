import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/auth.store';
import { PageHeader } from '../../../components/ui/PageHeader';
import { eventoService } from '../services/evento.service';
import { MisAsignacionesResponseDTO } from '../types/evento.types';
import { Loader2, Calendar, MapPin, QrCode, ArrowLeft } from 'lucide-react';

const formatDate = (dateString: string) => {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  return timeString.substring(0, 5);
};

export default function MisAsignacionesPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [asignaciones, setAsignaciones] = useState<MisAsignacionesResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      try {
        const data = await eventoService.getMisAsignacionesStaff();
        setAsignaciones(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar asignaciones');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAsignaciones();
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 max-w-6xl mx-auto">
      
      {/* ── HEADER ── */}
      <PageHeader
        title="Mis Asignaciones de Staff"
        subtitle={`Bienvenido, ${user?.username}. Eventos en los que estás asignado como personal de control de ingreso.`}
        action={
          <Link
            to="/dashboard/portal"
            className="flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 border border-white/10 font-medium py-2 px-5 rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Volver al Catálogo
          </Link>
        }
      />

      <div className="max-w-6xl mx-auto mt-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p>Cargando tus asignaciones...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : asignaciones.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/20 border border-white/5 rounded-2xl">
            <QrCode className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400 text-lg">No tienes eventos asignados actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asignaciones.map((evento) => (
              <div
                key={evento.idEvento}
                className="bg-gray-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white line-clamp-2">
                      {evento.nombreEvento}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                      evento.estadoEvento === 'PUBLICADO' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {evento.estadoEvento}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span>{formatDate(evento.fechaEvento)} - {formatTime(evento.horaEvento)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-500" />
                      <span className="truncate">{evento.lugarEvento}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/dashboard/eventos/${evento.idEvento}/checkin`)}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium transition-colors"
                  >
                    <QrCode size={18} />
                    Ir al Check-in
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
