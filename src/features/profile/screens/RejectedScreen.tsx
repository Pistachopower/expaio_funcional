import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../../../lib/supabaseClient';

export const RejectedScreen: React.FC = () => {
    const { profile, signOut, refreshProfile } = useAuth();
    const { userName } = useProfile(profile);
    const [isConverting, setIsConverting] = useState(false);
    
    const convertToEmigrant = async () => {
        if (!profile?.id) return;
        setIsConverting(true);
        try {
            // Eliminar su solicitud formal en la tabla expertos (si existe) para dejar un canvas limpio
            await supabase.from('expertos').delete().eq('usuario_id', profile.id);

            // Convertirlo a emigrante estandar y aprobar su cuenta general
            const { error } = await supabase
                .from('perfiles')
                .update({ 
                    rol: 'emigrante',
                    estado_cuenta: 'aprobado' 
                })
                .eq('id', profile.id);
            
            if (error) throw error;
            
            await refreshProfile(); // Esto forzará a App.tsx a cargar el HomeScreen
        } catch (error: any) {
            alert('Error al actualizar el rol: ' + error.message);
            setIsConverting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in gap-4 mt-10">
            <span className="material-symbols-outlined text-[80px] text-red-500 font-light drop-shadow-sm">cancel</span>
            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-[#111815] dark:text-white">Hola, {userName}</h1>
                <h2 className="text-xl font-medium text-red-600 dark:text-red-400">Postulación Declinada</h2>
            </div>
            
            <div className="bg-white dark:bg-[#111c18] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 max-w-lg w-full mt-2 text-left">
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    Nuestro equipo ha revisado tu postulación como especialista registrado en nuestra plataforma. 
                    Lamentablemente, en esta ocasión no podemos aprobar tu perfil público profesional, ya que no 
                    cumple con todos nuestros requisitos actuales de verificación o capacidad del directorio.
                </p>
                <div className="flex bg-cyan-50 dark:bg-cyan-500/10 p-4 rounded-2xl mt-4 items-start gap-3 border border-cyan-100 dark:border-cyan-900/30">
                    <span className="material-symbols-outlined text-cyan-500 mt-0.5">lightbulb</span>
                    <p className="text-sm text-left text-cyan-800 dark:text-cyan-300">
                        <strong>¡Pero no tienes que irte!</strong> Puedes conservar tu cuenta y convertirte en 
                        un <b>usuario migrante normal</b>. Podrás utilizar todas nuestras calculadoras, guías, directorio 
                        y asistencia inteligente sin restricciones.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-4">
                <button 
                    onClick={signOut} 
                    className="flex-1 px-5 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Salir y pensar
                </button>
                <button 
                    onClick={convertToEmigrant}
                    disabled={isConverting}
                    className="flex-[2] flex items-center justify-center gap-2 px-5 py-4 bg-primary text-[#11211a] hover:brightness-105 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm sm:text-base disabled:opacity-50"
                >
                    {isConverting ? (
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                    ) : (
                        <span className="material-symbols-outlined">person_add</span>
                    )}
                    {isConverting ? "Actualizando perfil..." : "Continuar como Migrante Normal"}
                </button>
            </div>
        </div>
    );
};
