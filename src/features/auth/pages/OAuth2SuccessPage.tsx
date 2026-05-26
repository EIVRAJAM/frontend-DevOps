import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../app/store/auth.store';
import { extractRoles, extractSubject } from '../../../utils/jwt.utils';

export const OAuth2SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  useEffect(() => {
    const rawToken = searchParams.get('token');

    if (!rawToken) {
      // No hay token, redirigir al login con error
      navigate('/login?error=no_token', { replace: true });
      return;
    }

    try {
      // Decodificar URL (el backend lo codifica)
      const token = decodeURIComponent(rawToken);

      // Extraer el username real del token o usar uno por defecto
      const username = extractSubject(token);

      // Guardar el token en localStorage (la clave "auth-storage" se gestiona a través del store)
      setCredentials(token, { username });

      // Limpiar la URL (remover query params) para que el token no se quede en el historial
      window.history.replaceState({}, document.title, window.location.pathname);

      // Obtener roles del JWT para decidir a dónde redirigir
      const roles = extractRoles(token);

      if (roles.includes('ROLE_ADMIN')) {
        navigate('/dashboard', { replace: true });
      } else if (roles.includes('ROLE_ORGANIZER')) {
        navigate('/dashboard/eventos', { replace: true });
      } else {
        navigate('/dashboard/portal', { replace: true });
      }
    } catch (error) {
      console.error('Error procesando token OAuth2:', error);
      navigate('/login?error=token_processing_failed', { replace: true });
    }
  }, [searchParams, navigate, setCredentials]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
      <h2 className="text-white text-xl font-medium">Completando tu autenticación...</h2>
      <p className="text-gray-400 text-sm mt-2">Por favor espera un momento.</p>
    </div>
  );
};
