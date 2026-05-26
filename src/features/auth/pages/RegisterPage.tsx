import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl tracking-wider hover:opacity-80 transition-opacity">
          DevOps<span className="text-indigo-500">App</span>
        </Link>
      </div>

      <div className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mt-12 mb-12 relative overflow-hidden">
        <RegisterForm />
        
        <div className="mt-8 text-center text-sm text-gray-400 pt-6 border-t border-white/10">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
