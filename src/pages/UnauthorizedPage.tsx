import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="max-w-md w-full bg-gray-900/30 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Acceso Denegado</h1>
        <p className="text-gray-400 mb-8">
          No tienes los permisos necesarios para acceder a esta página. Contacta al administrador si crees que esto es un error.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
