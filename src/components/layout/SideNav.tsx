import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from '../ui/NavLink';
import { useAuth } from '../../context/AuthContext';

export const SideNav: React.FC = () => {
    const location = useLocation();
    const { profile } = useAuth();
    const getActive = (path: string) => location.pathname === path;

    const isEmigrante = profile?.rol === 'emigrante' || !profile?.rol;
    const isAdmin = profile?.rol === 'admin';
    const isProfessional = ['profesor', 'abogado', 'ayuda'].includes(profile?.rol || '');

    return (
        <div className="hidden md:flex flex-col w-64 h-full bg-white dark:bg-card-dark border-r border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div className="flex items-center justify-center size-8 bg-primary rounded-lg shadow-sm shadow-primary/30">
                    <span className="material-symbols-outlined text-[#11211a] text-[20px] font-bold">all_inclusive</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight text-[#111815] dark:text-white">ExpaIO</span>
            </div>

            <nav className="space-y-1 flex-1">
                <NavLink to="/" icon="home" label="Inicio" isActive={getActive('/')} vertical />
                
                {(isEmigrante || isAdmin) && (
                    <>
                        <NavLink to="/checklist" icon="check_circle" label="Checklist" isActive={getActive('/checklist')} vertical />
                        <NavLink to="/safety" icon="shield" label="Seguridad" isActive={getActive('/safety')} vertical />
                        <NavLink to="/directory" icon="list_alt" label="Directorio" isActive={getActive('/directory')} vertical />
                        <NavLink to="/chat" icon="smart_toy" label="Asistente IA" isActive={getActive('/chat')} vertical />
                        <NavLink to="/audios-integracion" icon="psychology" label="Integración" isActive={getActive('/audios-integracion')} vertical />
                    </>
                )}

                {isAdmin && (
                    <NavLink to="/admin" icon="admin_panel_settings" label="Panel Admin" isActive={getActive('/admin')} vertical />
                )}

                <NavLink to="/about" icon="info" label="Sobre Nosotros" isActive={getActive('/about')} vertical />
            </nav>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <NavLink to="/profile" icon="person" label="Mi Perfil" isActive={getActive('/profile')} vertical />
            </div>
        </div>
    );
};
