import React from 'react';
import { Link } from 'react-router-dom';
import { NavItemProps } from '../../types';

export const NavLink: React.FC<NavItemProps & { vertical?: boolean }> = ({ to, icon, label, isActive, vertical }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${vertical
            ? `w-full ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`
            : `flex-col justify-center w-full h-full gap-1 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'}`
            }`}
    >
        <span className={`material-symbols-outlined ${vertical ? 'text-[24px]' : 'text-[24px]'} ${isActive ? 'filled' : ''}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
        <span className={`${vertical ? 'text-sm font-bold' : 'text-[10px] font-medium'}`}>{label}</span>
        {vertical && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
    </Link>
);
