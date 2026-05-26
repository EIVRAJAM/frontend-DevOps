import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarDays, Ticket, DollarSign, RefreshCcw, MonitorDot,
  TrendingUp, UserPlus, ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { dashboardService } from '../services/dashboard.service';
import { DashboardStatsResponse } from '../types/dashboard.types';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export default function GeneralDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-400 text-sm">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 space-y-6">
      <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-4 sm:p-6 md:p-8 backdrop-blur-xl overflow-hidden">
        <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Bienvenido, {user?.username}</h1>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm">Panel de administración — vista general del sistema.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard to="/dashboard/usuarios" icon={Users} label="Usuarios" value={stats?.totalUsuarios?.toLocaleString()} sub={`${stats?.usuariosActivos} activos`} color="indigo" />
        <StatCard to="/dashboard/eventos" icon={CalendarDays} label="Eventos" value={stats?.totalEventos?.toLocaleString()} sub={`${stats?.eventosPublicados} publicados`} color="emerald" />
        <StatCard to="/dashboard/mis-tickets" icon={Ticket} label="Tickets" value={stats?.totalTickets?.toLocaleString()} sub={`${stats?.ticketsVendidosHoy} hoy`} color="blue" />
        <StatCard to="#" icon={DollarSign} label="Ingresos" value={stats?.montoTotalPagos ? `$${(stats.montoTotalPagos / 1000).toFixed(0)}k` : '$0'} sub={`${stats?.totalPagos} transacciones`} color="amber" />
        <StatCard to="#" icon={RefreshCcw} label="Reembolsos" value={String(stats?.reembolsosPendientes ?? 0)} sub="pendientes" color="rose" />
        <StatCard to="/dashboard/sesiones" icon={MonitorDot} label="Sesiones" value={String(stats?.sesionesActivas ?? 0)} sub="activas" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/40 flex items-center justify-center shrink-0">
                  <UserPlus size={15} className="text-indigo-200" />
                </div>
                <h3 className="text-sm font-semibold text-white">Últimos Usuarios</h3>
              </div>
              <Link to="/dashboard/usuarios" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {stats?.ultimosUsuarios?.map((u) => (
                <Link
                  key={u.idUsuario}
                  to={`/dashboard/usuarios/${u.idUsuario}`}
                  className="flex items-center justify-between px-4 sm:px-6 py-3 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/25 border border-indigo-500/40 flex items-center justify-center text-xs font-semibold text-indigo-200 shrink-0">
                      {u.nombres[0]}{u.apellidos[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200 truncate">{u.nombres} {u.apellidos}</p>
                      <p className="text-xs text-gray-500">#{u.idUsuario}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 ml-3">{new Date(u.fechaCreacion).toLocaleDateString('es-CO')}</span>
                </Link>
              ))}
              {(!stats?.ultimosUsuarios || stats.ultimosUsuarios.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-gray-500">No hay usuarios registrados aún.</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/40 flex items-center justify-center shrink-0">
                  <TrendingUp size={15} className="text-emerald-200" />
                </div>
                <h3 className="text-sm font-semibold text-white">Próximos Eventos</h3>
              </div>
              <Link to="/dashboard/eventos" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0">
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats?.proximosEventos?.map((e) => (
                <Link
                  key={e.idEvento}
                  to={`/dashboard/eventos/${e.idEvento}`}
                  className="rounded-2xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors flex flex-col items-center justify-center text-center p-3 sm:p-4 gap-2 h-28 sm:h-32"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/25 flex items-center justify-center">
                    <CalendarDays size={22} className="text-emerald-300" />
                  </div>
                  <p className="text-xs text-gray-200 line-clamp-2 leading-tight">{e.nombreEvento}</p>
                  <span className="text-[11px] text-emerald-300 font-medium">
                    {new Date(e.fechaEvento + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                  </span>
                </Link>
              ))}
              {(!stats?.proximosEventos || stats.proximosEventos.length === 0) && (
                <div className="col-span-2 py-8 text-center text-sm text-gray-500">No hay eventos programados.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ to, icon: Icon, label, value, sub, color }: {
  to: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  sub: string;
  color: 'indigo' | 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
}) => {
  const colors = {
    indigo: { bg: 'bg-indigo-600/40', border: 'border-indigo-400/50', icon: 'text-indigo-200', text: 'text-indigo-100' },
    emerald: { bg: 'bg-emerald-600/40', border: 'border-emerald-400/50', icon: 'text-emerald-200', text: 'text-emerald-100' },
    blue: { bg: 'bg-blue-600/40', border: 'border-blue-400/50', icon: 'text-blue-200', text: 'text-blue-100' },
    amber: { bg: 'bg-amber-600/40', border: 'border-amber-400/50', icon: 'text-amber-200', text: 'text-amber-100' },
    rose: { bg: 'bg-rose-600/40', border: 'border-rose-400/50', icon: 'text-rose-200', text: 'text-rose-100' },
    purple: { bg: 'bg-purple-600/40', border: 'border-purple-400/50', icon: 'text-purple-200', text: 'text-purple-100' },
  };
  const c = colors[color];

  return (
    <Link
      to={to}
      className={`${c.bg} border ${c.border} rounded-2xl p-3 sm:p-5 backdrop-blur-xl hover:scale-[1.03] transition-all duration-300 group overflow-hidden`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className={`${c.icon} sm:w-[22px] sm:h-[22px]`} />
        <span className="text-[11px] sm:text-sm text-gray-400 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">{value ?? '...'}</p>
      <p className={`text-[11px] sm:text-xs mt-1 truncate ${c.text}`}>{sub}</p>
    </Link>
  );
};
