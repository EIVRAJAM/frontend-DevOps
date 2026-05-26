import React, { useEffect, useState } from 'react';
import { eventoService } from '../services/evento.service';
import { usuarioService } from '../../usuarios/services/usuario.service';
import { UsuarioOrganizadorResponse } from '../../usuarios/types/usuario.types';
import { usePermissions } from '../../../hooks/usePermissions';
import { StaffResponseDTO } from '../types/evento.types';
import { Loader2, UserPlus, Check, X, Search, User, Hash } from 'lucide-react';

interface EventoStaffTabProps {
  idEvento: number;
}

export const EventoStaffTab: React.FC<EventoStaffTabProps> = ({ idEvento }) => {
  const { isAdmin } = usePermissions();
  const [staff, setStaff] = useState<StaffResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [idUsuarioInput, setIdUsuarioInput] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UsuarioOrganizadorResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const data = await eventoService.getStaff(idEvento);
      setStaff(data);
    } catch (err: any) {
      setError('Error al cargar la lista de staff.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [idEvento]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUsuarioInput.trim()) return;
    setIsAssigning(true);
    setError(null);
    try {
      await eventoService.assignStaff(idEvento, { idUsuario: Number(idUsuarioInput) });
      setIdUsuarioInput('');
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar staff.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = isAdmin
        ? await usuarioService.getAll({ nombres: searchQuery, size: 5 })
        : await usuarioService.searchOrganizador({ nombres: searchQuery, size: 5 });
      setSearchResults(data.content as any);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const assignUserFromSearch = async (idUsuario: number) => {
    setIsAssigning(true);
    setError(null);
    try {
      await eventoService.assignStaff(idEvento, { idUsuario });
      await fetchStaff();
      setSearchResults(prev => prev.filter(u => u.idUsuario !== idUsuario));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar staff.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleToggleEstado = async (idUsuario: number, estadoActual: string) => {
    try {
      if (estadoActual === 'ACTIVO') {
        await eventoService.desactivarStaff(idEvento, idUsuario);
      } else {
        await eventoService.activarStaff(idEvento, idUsuario);
      }
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar estado.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        <Loader2 className="animate-spin mr-2" size={20} /> Cargando staff...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="rounded-2xl border border-white/5 bg-gray-900/30 p-5 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-indigo-400" />
          Buscar y Asignar Staff
        </h3>

        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500/60"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            {isSearching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Buscar
          </button>
        </form>

        {hasSearched && (
          <div className="rounded-xl border border-white/5 bg-gray-950/50 divide-y divide-white/5 max-h-56 overflow-y-auto">
            {isSearching ? (
              <p className="text-gray-500 text-xs text-center py-4">Buscando...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">No se encontraron usuarios.</p>
            ) : (
              searchResults.map(user => {
                const isAlreadyStaff = staff.some(s => s.idUsuario === user.idUsuario);
                return (
                  <div key={user.idUsuario} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/3 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xs font-semibold text-indigo-300 shrink-0">
                        {user.nombres[0]}{user.apellidos[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-200 truncate">{user.nombres} {user.apellidos}</p>
                        <p className="text-xs text-gray-500">Doc: {user.documento}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => assignUserFromSearch(user.idUsuario)}
                      disabled={isAssigning || isAlreadyStaff}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 shrink-0 ml-3 ${
                        isAlreadyStaff
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'
                      }`}
                    >
                      {isAlreadyStaff ? <Check size={12} /> : <UserPlus size={12} />}
                      {isAlreadyStaff ? 'Asignado' : 'Asignar'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-white/5">
          <form onSubmit={handleAssign} className="flex gap-2">
            <input
              type="number"
              min="1"
              placeholder="O asigna directamente por ID de usuario..."
              value={idUsuarioInput}
              onChange={(e) => setIdUsuarioInput(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500/60"
            />
            <button
              type="submit"
              disabled={isAssigning || !idUsuarioInput.trim()}
              className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-gray-300 px-4 py-2 text-xs font-medium transition-colors shrink-0"
            >
              Asignar por ID
            </button>
          </form>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <User size={16} className="text-indigo-400" />
          Staff Actual ({staff.length})
        </h3>
        {staff.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center rounded-xl border border-white/5 bg-gray-900/20">
            No hay personal asignado a este evento.
          </p>
        ) : (
          <div className="divide-y divide-white/5 rounded-2xl border border-white/5 bg-gray-900/30 overflow-hidden">
            {staff.map((s) => (
              <div key={s.idEventoStaff} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xs font-semibold text-indigo-300 shrink-0">
                    {s.nombreCompleto?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 truncate">{s.nombreCompleto}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <span>ID: {s.idUsuario}</span>
                      <span>·</span>
                      <span>{new Date(s.asignadoEn).toLocaleDateString('es-CO')}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    s.estado === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {s.estado}
                  </span>
                  <button
                    onClick={() => handleToggleEstado(s.idUsuario, s.estado)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      s.estado === 'ACTIVO'
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-green-400 hover:bg-green-500/10'
                    }`}
                    title={s.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                  >
                    {s.estado === 'ACTIVO' ? <X size={16} /> : <Check size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
