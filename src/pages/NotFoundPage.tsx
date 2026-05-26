import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="max-w-md w-full bg-gray-900/30 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-8">La página que buscas no existe.</p>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
