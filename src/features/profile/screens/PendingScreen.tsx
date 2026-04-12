import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export const PendingScreen: React.FC = () => {
    const { signOut } = useAuth();
    
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in gap-4 mt-20">
            <span className="material-symbols-outlined text-[80px] text-orange-400">pending_actions</span>
            <h1 className="text-2xl font-bold text-[#111815] dark:text-white">Perfil en Revisión</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Tu perfil profesional está siendo revisado por nuestro equipo de administradores por razones de seguridad. 
                Te notificaremos en cuanto tu acceso haya sido verificado y aprobado.
            </p>
            <button 
                onClick={signOut} 
                className="mt-6 px-6 py-3 bg-gray-200 dark:bg-card-dark text-[#111815] dark:text-white rounded-xl font-bold shadow-sm active:scale-95 transition-transform"
            >
                Cerrar Sesión
            </button>
        </div>
    );
};
