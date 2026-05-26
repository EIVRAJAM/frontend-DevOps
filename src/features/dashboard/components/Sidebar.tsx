import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Menu, LogOut, LayoutDashboard, Users, ShieldCheck,
  CalendarDays, Puzzle, MonitorDot, ChevronRight, UserCircle, QrCode, Ticket, Home, RefreshCcw
} from 'lucide-react';
import { NavItemType } from '../types/sidebar.types';
import { ROLES } from '../../../config/roles';
import { useAuthStore } from '../../../app/store/auth.store';
import { useLogout } from '../../auth/hooks/useLogout';
import { useStaffAssignments } from '../../../hooks/useStaffAssignments';

const NAV_MENU: NavItemType[] = [
  {
    id: 'catalogo',
    title: 'Catálogo de Eventos',
    icon: Home,
    path: '/dashboard/portal',
    roles: [ROLES.ADMIN, ROLES.ORGANIZER, ROLES.USER],
  },
  {
    id: 'mis-tickets',
    title: 'Mis Tickets',
    icon: Ticket,
    path: '/dashboard/mis-tickets',
    roles: [ROLES.USER],
  },
  {
    id: 'mis-reembolsos',
    title: 'Mis Reembolsos',
    icon: RefreshCcw,
    path: '/dashboard/mis-reembolsos',
    roles: [ROLES.USER],
  },
  {
    id: 'dashboard',
    title: 'Panel General',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: [ROLES.ADMIN],
  },
  {
    id: 'usuarios',
    title: 'Usuarios',
    icon: Users,
    path: '/dashboard/usuarios',
    roles: [ROLES.ADMIN],
  },
  {
    id: 'accesos',
    title: 'Accesos',
    icon: ShieldCheck,
    path: '/dashboard/accesos',
    roles: [ROLES.ADMIN],
  },
  {
    id: 'eventos',
    title: 'Eventos',
    icon: CalendarDays,
    path: '/dashboard/eventos',
    roles: [ROLES.ADMIN, ROLES.ORGANIZER],
  },
  {
    id: 'funcionalidades',
    title: 'Funcionalidades',
    icon: Puzzle,
    path: '/dashboard/funcionalidades',
    roles: [ROLES.ADMIN],
  },
  {
    id: 'sesiones',
    title: 'Sesiones',
    icon: MonitorDot,
    path: '/dashboard/sesiones',
    roles: [ROLES.ADMIN],
  },
  {
    id: 'profile',
    title: 'Perfil',
    icon: UserCircle,
    path: '/dashboard/profile',
    roles: [ROLES.ADMIN, ROLES.ORGANIZER, ROLES.USER],
  },
];

interface SidebarItemProps {
  item: NavItemType;
  isExpanded: boolean;
}

const SidebarNavItem: React.FC<SidebarItemProps> = ({ item, isExpanded }) => {
  const { pathname } = useLocation();
  const hasSubModules = item.subModules && item.subModules.length > 0;
  const isActive = item.path === pathname || (hasSubModules && item.subModules?.some(s => s.path === pathname));
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;

  const baseClasses = `relative flex items-center justify-between py-3 px-4 mx-2 rounded-xl cursor-pointer transition-all duration-200 group
    ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`;

  const content = (
    <div onClick={() => hasSubModules && isExpanded && setIsOpen(!isOpen)} className={baseClasses} title={!isExpanded ? item.title : undefined}>
      <div className="flex items-center gap-3 w-full">
        <Icon size={20} className={`${isActive ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-400'} transition-colors shrink-0`} />
        {isExpanded && <span className="text-sm truncate whitespace-nowrap">{item.title}</span>}
      </div>
      {isExpanded && hasSubModules && (
        <ChevronRight size={16} className={`${isOpen ? 'rotate-90' : ''} transition-transform text-gray-500 shrink-0`} />
      )}
    </div>
  );

  if (!hasSubModules && item.path) {
    return <NavLink to={item.path} className="block mt-1">{content}</NavLink>;
  }

  return (
    <div className="mt-1">
      {content}
      {isExpanded && isOpen && hasSubModules && (
        <div className="flex flex-col gap-1 mt-1 pl-4 mx-2 border-l border-white/5 animate-in slide-in-from-top-2 fade-in duration-200">
          {item.subModules!.map((sub) => {
            const SubIcon = sub.icon;
            const subActive = pathname === sub.path;
            return (
              <NavLink
                key={sub.id}
                to={sub.path!}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm transition-colors ${subActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
              >
                <SubIcon size={16} className="shrink-0" />
                <span className="truncate">{sub.title}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const hasStaffAssignments = useStaffAssignments();
  const { logout } = useLogout();
  const user = useAuthStore(state => state.user);

  const filteredMenu = NAV_MENU.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => user?.roles.includes(role));
  });

  if (hasStaffAssignments) {
    filteredMenu.push({
      id: 'asignaciones',
      title: 'Operación / Check-in',
      icon: QrCode,
      path: '/dashboard/asignaciones',
    });
  }

  const sidebarContent = (
    <>
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 overflow-hidden shrink-0">
        <div className={`font-bold text-xl tracking-widest text-white truncate transition-opacity duration-300 ${!isExpanded && 'opacity-0 w-0'}`}>
          DevOps<span className="text-indigo-500">App</span>
        </div>
        <button onClick={() => { setIsExpanded(!isExpanded); setIsMobileOpen(false); }} className="text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 shrink-0">
          <Menu size={22} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-0.5 custom-scrollbar">
        <div className={`px-5 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300 ${!isExpanded && 'opacity-0'}`}>
          Menú Principal
        </div>
        {filteredMenu.map((item) => (
          <SidebarNavItem key={item.id} item={item} isExpanded={isExpanded} />
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 shrink-0">
        <button
          onClick={logout}
          title={!isExpanded ? 'Cerrar Sesión' : undefined}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-medium border border-transparent hover:border-red-500/30 group`}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform shrink-0" />
          {isExpanded && <span className="truncate">Cerrar Sesión</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-gray-900/80 border border-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <Menu size={22} />
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`
        ${isExpanded ? 'w-64' : 'w-[84px]'}
        h-screen bg-gray-900/50 backdrop-blur-3xl border-r border-white/10 flex flex-col transition-all duration-300 relative z-30 shrink-0
        hidden lg:flex
        ${isMobileOpen ? '!flex fixed inset-y-0 left-0 z-50 w-64' : ''}
      `}>
        {sidebarContent}
      </aside>
    </>
  );
};
