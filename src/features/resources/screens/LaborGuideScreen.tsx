import React from 'react';
import { BackHeader } from '../../../components';

export const LaborGuideScreen: React.FC = () => {
    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader title="Derechos Laborales" />
            <div className="px-4 py-4">
                <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[180px] shadow-sm relative group" style={{ backgroundImage: 'url("https://picsum.photos/seed/switzerland2/600/300")' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative p-4 z-10">
                        <span className="inline-flex items-center gap-1 bg-primary/90 text-[#11211a] text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md">
                            <span className="material-symbols-outlined text-[16px]">gavel</span>
                            Ley Suiza
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-6 space-y-4">
                <section>
                    <h2 className="text-[#111815] dark:text-white text-xl font-bold leading-tight mb-2">Vacaciones y Horarios</h2>
                    <p className="text-[#111815] dark:text-gray-300 text-sm font-normal leading-relaxed">
                        El mínimo legal son 4 semanas (20 días) al año. Si tienes menos de 20 años, son 5 semanas. La semana laboral típica es de 40 a 42.5 horas.
                    </p>
                </section>

                <section className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-sm mb-2 dark:text-white">Despido</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        En Suiza el despido es más flexible que en España. Generalmente hay un periodo de aviso (1-3 meses según antigüedad), pero no existe indemnización por despido improcedente salvo casos muy graves.
                    </p>
                </section>
            </div>
        </div>
    );
};
