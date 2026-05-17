import React from 'react';
import { BackHeader } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { useRole } from '../../../hooks/useRole';

export const ConsultasScreen: React.FC = () => {
    const { profile } = useAuth();
    const { role } = useRole();

    const rolLabel = role === 'abogado' ? 'Abogado' : role === 'profesor' ? 'Profesor' : 'Profesional';

    return (
        <div className="flex flex-col h-full animate-fade-in w-full">
            <BackHeader title="Mis Consultas" />

            <div className="flex-1 flex flex-col p-4 w-full max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">forum</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#111815] dark:text-white tracking-tight">Panel de {rolLabel}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona las consultas de los migrantes</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-2xl font-extrabold text-primary">0</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Pendientes</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-2xl font-extrabold text-blue-500">0</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">En curso</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-2xl font-extrabold text-green-500">0</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Resueltas</p>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                    <div className="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
                        <span className="material-symbols-outlined text-gray-400 text-4xl">inbox</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111815] dark:text-white mb-2">Sin consultas por ahora</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                        Cuando un migrante solicite tu ayuda como {rolLabel.toLowerCase()}, las consultas aparecerán aquí.
                    </p>
                    <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-2xl p-4 max-w-sm">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-purple-500 mt-0.5">tips_and_updates</span>
                            <div className="text-left">
                                <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">Consejo</p>
                                <p className="text-xs text-purple-600 dark:text-purple-400 leading-relaxed">
                                    Mantén tu perfil actualizado con tus especialidades y datos de contacto para que los migrantes te encuentren más fácilmente en el Directorio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
