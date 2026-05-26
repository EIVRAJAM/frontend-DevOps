import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventoService } from '../services/evento.service';
import { CheckInEstadoDTO, ResumenCheckInDTO, EventoResponse } from '../types/evento.types';
import { PageHeader } from '../../../components/ui/PageHeader';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { QRScanner } from '../components/QRScanner';
import { Loader2, QrCode, Users, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function CheckInPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<EventoResponse | null>(null);
  const [resumen, setResumen] = useState<ResumenCheckInDTO | null>(null);
  const [estadoCheckIn, setEstadoCheckIn] = useState<CheckInEstadoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const messageTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchResumen = async () => {
    try {
      const data = await eventoService.getCheckInResumen(Number(id));
      setResumen(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventoData, resumenData] = await Promise.all([
          eventoService.getById(Number(id)),
          eventoService.getCheckInResumen(Number(id))
        ]);
        setEvento(eventoData);
        setResumen(resumenData);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Error al cargar datos del evento' });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const checkEstado = async () => {
      try {
        const estado = await eventoService.getCheckInEstado(Number(id));
        setEstadoCheckIn(estado);
      } catch {
        // ignore
      }
    };
    checkEstado();
    pollRef.current = setInterval(checkEstado, 30000);
    return () => clearInterval(pollRef.current);
  }, [id]);

  useEffect(() => {
    if (!isLoading && estadoCheckIn?.habilitado && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, estadoCheckIn]);

  useEffect(() => {
    if (message) {
      clearTimeout(messageTimer.current);
      messageTimer.current = setTimeout(() => setMessage(null), 3000);
    }
    return () => clearTimeout(messageTimer.current);
  }, [message]);

  const executeCheckIn = async (code: string) => {
    if (!code.trim()) return;
    setIsCheckingIn(true);
    setMessage(null);
    try {
      const response = await eventoService.checkIn(Number(id), { codigoQr: code.trim() });
      setMessage({ type: 'success', text: `Ingreso validado para: ${response.nombreAsistente}` });
      setQrInput('');
      await fetchResumen();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error al validar ticket' });
      setQrInput('');
    } finally {
      setIsCheckingIn(false);
      inputRef.current?.focus();
    }
  };

  const handleCheckInFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    executeCheckIn(qrInput);
  };

  const handleScanSuccess = (decodedText: string) => {
    setQrInput(decodedText);
    executeCheckIn(decodedText);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">Cargando datos del evento...</p>
      </div>
    );
  }

  const habilitado = estadoCheckIn?.habilitado ?? false;

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
      <PageHeader
        title="Check-in"
        subtitle={evento?.nombreEvento}
        action={
          <Link
            to="/dashboard/asignaciones"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10"
          >
            <ArrowLeft size={16} /> Asignaciones
          </Link>
        }
      />

      {!habilitado && estadoCheckIn && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Clock size={36} className="text-amber-400" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-bold text-white">Check-in no disponible</h2>
            <p className="text-gray-400">{estadoCheckIn.motivo}</p>
            {estadoCheckIn.aperturaCheckin && (
              <p className="text-sm text-amber-400/70 pt-2">
                Se habilitará el {new Date(estadoCheckIn.aperturaCheckin).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            )}
          </div>
          <p className="text-xs text-gray-600">Esta página se actualiza automáticamente cada 30 segundos</p>
        </div>
      )}

      {habilitado && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <QrCode size={16} className="text-indigo-400" />
                Verificar Ingreso
              </h3>

              <form onSubmit={handleCheckInFormSubmit} className="space-y-4">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escanea o escribe el código QR del ticket..."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60"
                  disabled={isCheckingIn}
                />
                <button
                  type="submit"
                  disabled={isCheckingIn || !qrInput.trim()}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isCheckingIn ? <Loader2 size={18} className="animate-spin inline mr-2" /> : null}
                  {isCheckingIn ? 'Validando...' : 'Validar Ingreso'}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/5">
                <QRScanner onScanSuccess={handleScanSuccess} />
              </div>

              {message && (
                <div className={`mt-4 rounded-xl border px-4 py-3 text-sm flex items-start gap-3 ${
                  message.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                  {message.text}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} className="text-indigo-400" />
              Resumen
            </h3>

            {resumen && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Progreso</span>
                    <span>{resumen.porcentajeIngreso.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${resumen.porcentajeIngreso}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-950/50 border border-white/5 p-4 text-center">
                    <span className="text-2xl font-bold text-white">{resumen.totalIngresados}</span>
                    <p className="text-xs text-gray-500 mt-1">Ingresados</p>
                  </div>
                  <div className="rounded-xl bg-gray-950/50 border border-white/5 p-4 text-center">
                    <span className="text-2xl font-bold text-white">{resumen.totalPendientes}</span>
                    <p className="text-xs text-gray-500 mt-1">Pendientes</p>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <span className="text-xs text-gray-500">Total inscritos: {resumen.totalInscritos}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
