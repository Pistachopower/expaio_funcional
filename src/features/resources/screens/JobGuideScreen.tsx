import React from 'react';
import { BackHeader } from '../../../components';

export const JobGuideScreen: React.FC = () => {
    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader
                title="Guía de Empleo"
                showHelp={true}
                helpTitle="Acerca de la Guía de Empleo"
                helpText="Tu futuro en Suiza comienza con una estrategia sólida. Esta guía te lleva paso a paso desde el formato de tu CV hasta la comprensión de tu estatus legal, dándote la ventaja competitiva que necesitas."
            />

            <div className="p-4 sm:p-6 space-y-10">
                {/* INTRODUCCIÓN / MOTIVACIÓN */}
                <div className="text-center max-w-2xl mx-auto mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                        Hoja de Ruta para el Éxito
                    </span>
                    <h1 className="text-2xl font-black text-[#111815] dark:text-white mb-2">Tu Estrategia Laboral</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emigrar es un reto, pero con la preparación adecuada se convierte en una oportunidad.</p>
                </div>

                {/* PASO 1: PREPARACIÓN */}
                <div className="relative">
                    <div className="absolute -left-2 top-0 h-full w-1 bg-gradient-to-b from-primary to-transparent opacity-20 hidden sm:block"></div>

                    <div className="flex items-center gap-4 mb-6 relative">
                        <div className="size-12 rounded-2xl bg-[#111815] dark:bg-white text-white dark:text-[#111815] flex items-center justify-center font-black text-xl shadow-lg">
                            1
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Paso 1: La Preparación</h3>
                            <h2 className="text-xl font-bold dark:text-white">Domina el Estándar Suizo</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <section className="bg-white dark:bg-[#11211a] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
                            <h2 className="text-sm font-black text-[#111815] dark:text-white mb-4 uppercase tracking-tighter flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">analytics</span>
                                Anatomía del CV Suizo
                            </h2>
                            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 size-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <span><strong className="text-[#111815] dark:text-white font-bold">Foto Impecable:</strong> Una imagen profesional puede aumentar tus clics en un 40%. Debe ser sobria y de alta resolución.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 size-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <span><strong className="text-[#111815] dark:text-white font-bold">Estatus Legal:</strong> Menciona claramente tu nacionalidad UE y si ya cuentas con permiso.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="mt-1 size-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <span><strong className="text-[#111815] dark:text-white font-bold">Referencias Activas:</strong> En Suiza, las cartas de recomendación (*Arbeitszeugnis*) son tan importantes como el CV mismo.</span>
                                </li>
                            </ul>
                        </section>

                        {/* TIP DE EXPERTO */}
                        <div className="bg-gradient-to-br from-primary to-orange-600 p-0.5 rounded-3xl shadow-xl shadow-primary/10">
                            <div className="bg-white dark:bg-[#1a110a] h-full rounded-[1.4rem] p-6 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-3 text-primary">
                                    <span className="material-symbols-outlined font-black">verified</span>
                                    <span className="font-black text-[10px] uppercase tracking-widest">Consejo de Experto</span>
                                </div>
                                <p className="text-[#111815] dark:text-white font-bold leading-relaxed">
                                    "No traduzcas tu CV literalmente. Adapta tus títulos a los equivalentes suizos. Un 'Administrativo' en España puede ser un 'Kaufmann' con responsabilidades muy distintas aquí."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PASO 2: HERRAMIENTAS */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-12 rounded-2xl bg-[#111815] dark:bg-white text-white dark:text-[#111815] flex items-center justify-center font-black text-xl shadow-lg">
                            2
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Paso 2: Construcción</h3>
                            <h2 className="text-xl font-bold dark:text-white">Tus Herramientas de Edición</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* OFICIAL EU */}
                        <a
                            href="https://europass.europa.eu/es/create-europass-cv?utm_source=copilot.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white dark:bg-[#1a2e26] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between min-h-[160px]"
                        >
                            <div>
                                <h4 className="font-black text-[10px] mb-1 text-primary uppercase tracking-widest">Recomendado</h4>
                                <h5 className="font-bold text-sm mb-1 dark:text-white">Oficial Europass EU</h5>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">El estándar oro para empresas públicas y grandes corporaciones.</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-400 px-3 py-1 rounded-full">Web Editor</span>
                                <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                </div>
                            </div>
                        </a>

                        <a
                            href="https://www.orientacionparaelempleo.com/plantilla-curriculum-europass/?utm_source=copilot.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white dark:bg-[#1a2e26] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between min-h-[160px]"
                        >
                            <h4 className="font-black text-[10px] mb-1 text-gray-400 uppercase tracking-widest">Alternativa</h4>
                            <h5 className="font-bold text-sm mb-1 dark:text-white">Orientación Empleo</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Perfecto si prefieres trabajar en Word con una guía lateral.</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-400 px-3 py-1 rounded-full">Plantilla Word</span>
                                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">open_in_new</span>
                            </div>
                        </a>

                        <a
                            href="https://www.hoja-de-vida.co/europass-cv/?utm_source=copilot.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white dark:bg-[#1a2e26] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-primary/50 hover:shadow-xl transition-all flex flex-col justify-between min-h-[160px]"
                        >
                            <h4 className="font-black text-[10px] mb-1 text-gray-400 uppercase tracking-widest">Rápido</h4>
                            <h5 className="font-bold text-sm mb-1 dark:text-white">Hoja de Vida</h5>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">Diseños simplificados para una edición veloz.</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/5 text-gray-400 px-3 py-1 rounded-full">Acceso Directo</span>
                                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">open_in_new</span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* PASO 3: ACCIÓN */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-12 rounded-2xl bg-[#111815] dark:bg-white text-white dark:text-[#111815] flex items-center justify-center font-black text-xl shadow-lg">
                            3
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Paso 3: La Caza</h3>
                            <h2 className="text-xl font-bold dark:text-white">Canales Reales de Contratación</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="https://www.jobs.ch"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-[#111815] p-5 rounded-3xl hover:bg-[#1a2520] transition-all group"
                        >
                            <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-white text-2xl">J</div>
                            <div className="flex-1">
                                <h4 className="font-bold text-white">jobs.ch</h4>
                                <p className="text-[11px] text-gray-400">El portal líder. Filtra por 'Español' si tu alemán aún es bajo.</p>
                            </div>
                            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/jobs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-white dark:bg-[#11211a] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-primary/40 transition-all group"
                        >
                            <div className="size-12 bg-[#0077b5] rounded-2xl flex items-center justify-center font-black text-white">L</div>
                            <div className="flex-1">
                                <h4 className="font-bold dark:text-white">LinkedIn Suiza</h4>
                                <p className="text-[11px] text-gray-500">Esencial para perfiles IT, finanzas y multinacionales.</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                        </a>
                    </div>
                </div>

                {/* PASO 4: ESTATUS LEGAL */}
                <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0c1612] dark:to-[#11211a] p-8 rounded-[3rem] border border-gray-200 dark:border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <span className="material-symbols-outlined text-[120px]">gavel</span>
                    </div>

                    <div className="flex items-center gap-4 mb-6 relative">
                        <div className="size-12 rounded-2xl bg-primary text-[#11211a] flex items-center justify-center font-black text-xl shadow-lg">
                            4
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-primary uppercase tracking-widest">Paso 4: Legalidad</h3>
                            <h2 className="text-xl font-bold dark:text-white">Tu Derecho a Trabajar</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
                        <div className="space-y-4">
                            <div className="p-4 bg-white dark:bg-white/5 rounded-2xl">
                                <h4 className="font-black text-primary text-xs uppercase mb-1">Permiso L (Corto Plazo)</h4>
                                <p className="text-sm dark:text-gray-300 leading-relaxed">Para contratos de 3 a 12 meses. Es tu puerta de entrada habitual.</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-white/5 rounded-2xl">
                                <h4 className="font-black text-primary text-xs uppercase mb-1">Permiso B (Residencia)</h4>
                                <p className="text-sm dark:text-gray-300 leading-relaxed">Para contratos de más de un año. Permite la reagrupación familiar.</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl">
                                <p className="text-xs text-primary font-bold leading-relaxed italic">
                                    "IMPORTANTE: Como español no necesitas visado. Tu contrato de trabajo es la llave que genera automáticamente tu permiso. Tú solo debes registrarte en el 'Gemeinde' (ayuntamiento) al llegar."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
