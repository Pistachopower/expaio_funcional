import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from '../ui/NavLink';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const { profile } = useAuth();
    const getActive = (path: string) => location.pathname === path;

    const isEmigrante = profile?.rol === 'emigrante' || !profile?.rol;
    const isAdmin = profile?.rol === 'admin';
    const isProfessional = ['profesor', 'abogado', 'ayuda'].includes(profile?.rol || '');

    const showNav = ['/', '/directory', '/profile', '/safety', '/checklist', '/about', '/audios-integracion', '/guia-inicial'].includes(location.pathname);
    if (!showNav) return null;

    return (
        <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pt-2 px-6 flex justify-between items-end h-[70px] pb-4 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
            <NavLink to="/" icon="home" label="Inicio" isActive={getActive('/')} />
            
            {(isEmigrante || isAdmin) && (
                <NavLink to="/checklist" icon="check_circle" label="Checklist" isActive={getActive('/checklist')} />
            )}

            {(isEmigrante || isAdmin) && (
                <div className="relative -top-5">
                    <Link to="/chat" className={`flex items-center justify-center size-14 rounded-full shadow-lg transition-transform active:scale-95 ${getActive('/chat') ? 'bg-primary text-white' : 'bg-primary text-[#11211a]'}`}>
                        <span className="material-symbols-outlined text-[28px]">smart_toy</span>
                    </Link>
                </div>
            )}

            {isAdmin && (
                <NavLink to="/admin" icon="admin_panel_settings" label="Admin" isActive={getActive('/admin')} />
            )}

            {(!isEmigrante && !isAdmin) && (
                <NavLink to="/directorio" icon="folder_shared" label="Archivos" isActive={getActive('/directorio')} />
            )}

            <NavLink to="/profile" icon="person" label="Perfil" isActive={getActive('/profile')} />
        </div>
    );
};
