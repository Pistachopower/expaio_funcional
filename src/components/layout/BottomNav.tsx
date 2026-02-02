import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '../ui/NavLink';

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const getActive = (path: string) => location.pathname === path;

    const showNav = ['/', '/directory', '/profile', '/safety', '/checklist', '/about', '/audios-integracion'].includes(location.pathname);
    if (!showNav) return null;

    return (
        <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pt-2 px-6 flex justify-between items-end h-[70px] pb-4 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
            <NavLink to="/" icon="home" label="Inicio" isActive={getActive('/')} />
            <NavLink to="/checklist" icon="check_circle" label="Checklist" isActive={getActive('/checklist')} />

            <div className="relative -top-5">
                <Link to="/chat" className={`flex items-center justify-center size-14 rounded-full shadow-lg transition-transform active:scale-95 ${getActive('/chat') ? 'bg-primary text-white' : 'bg-primary text-[#11211a]'}`}>
                    <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                </Link>
            </div>

            <NavLink to="/safety" icon="shield" label="Seguridad" isActive={getActive('/safety')} />
            <NavLink to="/about" icon="info" label="Info" isActive={getActive('/about')} />
            <NavLink to="/profile" icon="person" label="Perfil" isActive={getActive('/profile')} />
        </div>
    );
};
