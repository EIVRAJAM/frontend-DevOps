import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const OAuth2ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const message = searchParams.get('message');

  React.useEffect(() => {
    if (reason || message) {
      console.error(`OAuth2 Error [${reason}]:`, message);
    }
  }, [reason, message]);

  const getErrorMessage = (): { title: string; description: string } => {
    switch (reason) {
      case 'email_not_found':
        return {
          title: 'Email no encontrado',
          description: 'No pudimos obtener tu email de Google. Asegúrate de haber autorizado el acceso a tu email.',
        };
      case 'server_error':
        return {
          title: 'Error interno',
          description: 'Ocurrió un error inesperado en nuestro servidor. Por favor, intenta nuevamente en unos momentos.',
        };
      default:
        return {
          title: 'Error de autenticación',
          description: message || 'Algo salió mal durante el proceso de autenticación con Google. Por favor, intenta nuevamente.',
        };
    }
  };

  const error = getErrorMessage();

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-full p-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-3">
            {error.title}
          </h1>

          <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
            {error.description}
          </p>

          <button
            onClick={handleBackToLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};
