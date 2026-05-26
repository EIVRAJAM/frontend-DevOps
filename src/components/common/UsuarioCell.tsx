import React, { useEffect, useState } from 'react';
import { usuarioService } from '../../features/usuarios/services/usuario.service';
import { UsuarioOrganizadorResponse } from '../../features/usuarios/types/usuario.types';
import { Loader2 } from 'lucide-react';

interface UsuarioCellProps {
  userId: number;
}

const UsuarioCell: React.FC<UsuarioCellProps> = ({ userId }) => {
  const [data, setData] = useState<UsuarioOrganizadorResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const result = await usuarioService.getByIdOrganizador(userId);
        if (!cancelled) setData(result);
      } catch {
        // fallback to ID
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <Loader2 size={12} className="animate-spin text-gray-500" />;
  if (!data) return <span className="text-gray-500 font-mono text-xs">#{userId}</span>;

  return (
    <div className="text-gray-300">
      <p className="text-sm">{data.nombres} {data.apellidos}</p>
      <p className="text-[11px] text-gray-500">{data.correo}</p>
    </div>
  );
};

export default UsuarioCell;
