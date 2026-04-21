import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface PendingUser {
    id: string;
    nombre: string;
    apellido: string;
    rol: string;
    telefono: string;
    fecha_nacimiento: string;
    como_nos_conocio: string;
    genero: string;
}

export const AdminDashboard: React.FC = () => {
    const [pendings, setPendings] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('perfiles')
            .select('id, nombre, apellido, rol, telefono, fecha_nacimiento, como_nos_conocio, genero')
            .eq('estado_cuenta', 'pendiente');
        
        if (!error && data) {
            setPendings(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendings();
    }, []);

    const approveUser = async (id: string, rol: string) => {
        // 1. Aprobar en la tabla perfiles
        const { error: profileError } = await supabase
            .from('perfiles')
            .update({ estado_cuenta: 'aprobado' })
            .eq('id', id);
        
        if (profileError) {
            alert("Error al aprobar en perfiles: " + profileError.message);
            return;
        }

        // 2. Si es experto, aprobar también en la tabla expertos
        if (['profesor', 'abogado', 'ayuda'].includes(rol)) {
            await supabase
                .from('expertos')
                .update({ aprobado: true })
                .eq('usuario_id', id);
        }

        setPendings(pendings.filter(p => p.id !== id));
    };

    const rejectUser = async (id: string) => {
        const confirmar = window.confirm("¿Seguro que deseas rechazar a este usuario? Ya no podrá entrar.");
        if (!confirmar) return;

        const { error } = await supabase
            .from('perfiles')
            .update({ estado_cuenta: 'rechazado' })
            .eq('id', id);
        
        if (!error) {
            setPendings(pendings.filter(p => p.id !== id));
        } else {
            alert("Error al rechazar: " + error.message);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in w-full max-w-5xl mx-auto px-6 pt-10 pb-24 md:pb-12 text-[#111815] dark:text-white">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                    <h1 className="text-3xl font-extrabold tracking-tight">Panel de Control</h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Gestiona las aprobaciones de la plataforma.</p>
            </header>

            <div className="bg-white dark:bg-[#111c18] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">hourglass_empty</span>
                    Usuarios Pendientes de Aprobación
                </h2>

                {loading ? (
                    <div className="flex justify-center p-6"><span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span></div>
                ) : pendings.length === 0 ? (
                    <div className="text-center p-12 text-gray-500 bg-gray-50 dark:bg-[#1a2e26] rounded-2xl">
                        No hay usuarios pendientes por aprobar en este momento.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendings.map(user => (
                            <div key={user.id} className="p-5 bg-gray-50 dark:bg-[#1a2e26] border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-primary/30">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg uppercase">
                                            {user.nombre.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{user.nombre} {user.apellido}</p>
                                            <p className="text-xs px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-md inline-block uppercase tracking-wider">
                                                {user.rol}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm text-gray-600 dark:text-gray-300">
                                        <p className="flex items-center gap-2 bg-white dark:bg-black/20 px-3 py-2 rounded-lg">
                                            <span className="material-symbols-outlined text-base text-gray-400">call</span>
                                            {user.telefono || "Sin teléfono"}
                                        </p>
                                        <p className="flex items-center gap-2 bg-white dark:bg-black/20 px-3 py-2 rounded-lg">
                                            <span className="material-symbols-outlined text-base text-gray-400">cake</span>
                                            {user.fecha_nacimiento || "Sin fecha nacimiento"}
                                        </p>
                                        <p className="flex items-center gap-2 bg-white dark:bg-black/20 px-3 py-2 rounded-lg md:col-span-2">
                                            <span className="material-symbols-outlined text-base text-gray-400">campaign</span>
                                            Referencia: <strong className="capitalize">{user.como_nos_conocio?.replace('_', ' ') || "Orgánico"}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    <button 
                                        onClick={() => rejectUser(user.id)}
                                        className="flex-1 md:flex-none px-5 py-3 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-xl">close</span>
                                        Rechazar
                                    </button>
                                    <button 
                                        onClick={() => approveUser(user.id, user.rol)}
                                        className="flex-1 md:flex-none px-5 py-3 bg-primary text-[#11211a] hover:brightness-105 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-xl">check</span>
                                        Aprobar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
