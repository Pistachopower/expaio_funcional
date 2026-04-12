import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface PendingUser {
    id: string;
    nombre: string;
    apellido: string;
    rol: string;
}

export const AdminDashboard: React.FC = () => {
    const [pendings, setPendings] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('perfiles')
            .select('id, nombre, apellido, rol')
            .eq('estado_cuenta', 'pendiente');
        
        if (!error && data) {
            setPendings(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPendings();
    }, []);

    const approveUser = async (id: string) => {
        const { error } = await supabase
            .from('perfiles')
            .update({ estado_cuenta: 'aprobado' })
            .eq('id', id);
        
        if (!error) {
            setPendings(pendings.filter(p => p.id !== id));
        } else {
            alert("Error al aprobar. ¿Ejecutaste la política SQL de Admin?");
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

            <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">hourglass_empty</span>
                    Usuarios Pendientes de Aprobación
                </h2>

                {loading ? (
                    <div className="flex justify-center p-6"><span className="material-symbols-outlined animate-spin text-primary">progress_activity</span></div>
                ) : pendings.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                        No hay usuarios pendientes por aprobar.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {pendings.map(user => (
                            <div key={user.id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{user.nombre} {user.apellido}</p>
                                    <p className="text-sm px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md inline-block mt-1 text-gray-600 dark:text-gray-300 capitalize">
                                        {user.rol}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => approveUser(user.id)}
                                    className="px-4 py-2 bg-primary text-white rounded-xl font-bold shadow-sm shadow-primary/30 active:scale-95 transition-transform"
                                >
                                    Aprobar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
