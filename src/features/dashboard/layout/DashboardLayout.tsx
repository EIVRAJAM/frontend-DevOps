import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {/* Contexto Ruteado por React Router anidado */}
            <Outlet />
         </div>
      </main>
    </div>
  );
};
