import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center">
        <div className="text-white font-bold text-xl tracking-wider">DevOps<span className="text-indigo-500">App</span></div>
      </div>
      
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
