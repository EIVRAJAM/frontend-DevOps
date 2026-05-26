import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NavItemType } from '../types/sidebar.types';

interface SidebarItemProps {
  item: NavItemType;
  isExpanded: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isExpanded }) => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const hasSubModules = item.subModules && item.subModules.length > 0;
  
  // Validates if current path falls under this module
  const isActive = item.path === pathname || (hasSubModules && item.subModules?.some(sub => sub.path === pathname));

  const toggleSubmenu = () => {
    if (hasSubModules && isExpanded) setIsOpen(!isOpen);
  };

  const Icon = item.icon;

  const content = (
    <div onClick={toggleSubmenu} 
         className={`relative flex items-center justify-between py-3 px-4 mx-2 rounded-xl cursor-pointer transition-all duration-200 group
             ${isActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
         `}>
      <div className="flex items-center gap-3 w-full">
        <Icon size={20} className={`${isActive ? 'text-indigo-500' : 'text-gray-500 group-hover:text-indigo-400'} transition-colors shrink-0`} />
        {isExpanded && <span className="text-sm truncate whitespace-nowrap">{item.title}</span>}
      </div>
      
      {isExpanded && hasSubModules && (
         <div className={`${isOpen ? 'rotate-90' : ''} transition-transform text-gray-500 shrink-0`}>
           <ChevronRight size={16} />
         </div>
      )}
      
      {/* Tooltip Mobile/Collapsed */}
      {!isExpanded && (
        <div className="absolute left-14 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none transition-opacity">
          {item.title}
        </div>
      )}
    </div>
  );

  if (!hasSubModules && item.path) {
    return (
      <NavLink to={item.path} className="block mt-1">
        {content}
      </NavLink>
    );
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
              <NavLink key={sub.id} to={sub.path!} className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm transition-colors ${subActive ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
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
