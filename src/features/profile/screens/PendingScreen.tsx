import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

export const PendingScreen: React.FC = () => {
    const { profile, signOut } = useAuth();
    const { userName } = useProfile(profile);
    
    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in gap-4 mt-20">
            <span className="material-symbols-outlined text-[80px] text-orange-400 font-light drop-shadow-sm">pending_actions</span>
            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-[#111815] dark:text-white">Hola, {userName}</h1>
                <h2 className="text-xl font-medium text-orange-600 dark:text-orange-400">Perfil en Revisión</h2>
            </div>
            
            <div className="bg-white dark:bg-[#111c18] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 max-w-md w-full mt-4">
                <p className="text-gray-600 dark:text-gray-300">
                    Tu postulación como especialista está siendo revisada por nuestro equipo de administradores manualmente. 
                </p>
                <div className="flex bg-orange-50 dark:bg-orange-500/10 p-4 rounded-2xl mt-4 items-start gap-3">
                    <span className="material-symbols-outlined text-orange-500 mt-0.5">info</span>
                    <p className="text-sm text-left text-orange-700 dark:text-orange-300 font-medium">Te lo notificaremos en cuanto tu acceso haya sido verificado y unificado con el directorio de ExpaIO.</p>
                </div>
            </div>

            <button 
                onClick={signOut} 
                className="mt-6 px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-card-dark text-[#111815] dark:text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-xl">logout</span>
                Salir por ahora
            </button>
        </div>
    );
};
