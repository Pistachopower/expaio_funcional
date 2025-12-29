import React from 'react';
import { BackHeader } from '../../../components';

export const OfferVerifierScreen: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in w-full max-w-2xl mx-auto">
            <BackHeader title="Verificador de Ofertas" />
            <div className="flex-1 overflow-y-auto pb-6">
                <div className="flex flex-col items-center justify-center pt-6 pb-4">
                    <div className="relative size-48 flex items-center justify-center">
                        <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                            <circle className="dark:stroke-[#2a4035]" cx="50" cy="50" fill="transparent" r="42" stroke="#e5e7eb" strokeWidth="8"></circle>
                            <circle className="gauge-circle shadow-[0_0_15px_rgba(255,77,79,0.5)] transition-all duration-1000 ease-out" cx="50" cy="50" fill="transparent" r="42" stroke="#ff4d4f" strokeDasharray="263.89" strokeDashoffset="224.3" strokeLinecap="round" strokeWidth="8"></circle>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-extrabold text-danger dark:text-[#ff6b6d] tracking-tighter">15</span>
                            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Trust Score</span>
                        </div>
                    </div>
                    <div className="mt-2 text-center px-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger-bg dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 mb-2">
                            <span className="size-2 rounded-full bg-danger animate-pulse"></span>
                            <span className="text-xs font-bold text-danger dark:text-red-300">Riesgo Crítico Detectado</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px] mx-auto leading-relaxed">
                            Esta oferta tiene múltiples indicadores de fraude comunes en Suiza.
                        </p>
                    </div>
                </div>

                <div className="px-4 mb-6">
                    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-red-100 dark:border-red-900/40 ring-1 ring-black/5">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <span className="material-symbols-outlined text-9xl">warning</span>
                        </div>
                        <div className="p-5 relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-danger text-2xl">priority_high</span>
                                </div>
                                <h3 className="text-[#111815] dark:text-white text-lg font-bold leading-tight">¡Cuidado! Oferta Milagrosa</h3>
                            </div>
                            <div className="space-y-3">
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    Se ha detectado una promesa de <span className="font-bold text-gray-900 dark:text-white">5 horas de trabajo</span> por un salario de <span className="font-bold text-gray-900 dark:text-white">8,000 CHF</span>.
                                </p>
                                <p className="text-danger dark:text-red-300 text-xs font-medium bg-danger-bg dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-900/30">
                                    Esto es estadísticamente imposible en el mercado suizo.
                                </p>
                            </div>
                            <div className="mt-5">
                                <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-danger hover:bg-red-600 text-white text-sm font-bold leading-normal transition-colors shadow-lg shadow-red-500/20">
                                    <span className="truncate">Entiendo el riesgo, continuar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4">
                    <h3 className="text-[#111815] dark:text-white text-base font-bold leading-tight tracking-[-0.015em] pb-3 px-1">Factores de Riesgo</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-[#2a4035]">
                            <div className="shrink-0 size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined">call_missed_outgoing</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#111815] dark:text-white text-sm font-bold">Número extranjero (+234)</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-normal">
                                    El prefijo no coincide con la ubicación anunciada (Zúrich).
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-[#2a4035]">
                            <div className="shrink-0 size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined">spellcheck</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[#111815] dark:text-white text-sm font-bold">Gramática Pobre</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-normal">
                                    Uso incorrecto de términos alemanes suizos estándar. Posible traducción automática.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-6"></div>
            </div>
        </div>
    );
};
