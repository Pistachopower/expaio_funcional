import React from 'react';
import { BackHeader } from '../../../components';

export const JobGuideScreen: React.FC = () => {
    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader
                title="Guía de Empleo"
                showHelp={true}
                helpTitle="Mercado Laboral"
                helpText="Encontrar trabajo es el primer paso para una integración exitosa. Aprende cómo adaptar tu CV al estándar suizo, dónde buscar ofertas y qué esperar de las entrevistas en el país."
            />

            <div className="p-4 space-y-6">
                <section className="bg-white dark:bg-card-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">description</span>
                        </div>
                        <h2 className="text-lg font-bold text-[#111815] dark:text-white">El CV Suizo</h2>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex gap-2">
                            <span className="material-symbols-outlined text-green-500 text-[18px]">check</span>
                            <span><strong>Foto Profesional:</strong> Es casi obligatoria y debe ser de alta calidad.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="material-symbols-outlined text-green-500 text-[18px]">check</span>
                            <span><strong>Datos Personales:</strong> Incluye fecha de nacimiento, nacionalidad y tipo de permiso (si tienes).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="material-symbols-outlined text-green-500 text-[18px]">check</span>
                            <span><strong>Referencias:</strong> Al final, pon "Referencias disponibles a petición". Son muy importantes aquí.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="material-symbols-outlined text-green-500 text-[18px]">check</span>
                            <span><strong>Idiomas:</strong> Sé honesto con el nivel (A1-C2).</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Dónde buscar</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="size-10 bg-gray-100 dark:bg-black/40 rounded-lg flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">J</div>
                            <div>
                                <h4 className="font-bold text-sm dark:text-white">jobs.ch</h4>
                                <p className="text-xs text-gray-500">El portal nº 1 en Suiza. Imprescindible.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="size-10 bg-[#0077b5] rounded-lg flex items-center justify-center font-bold text-white">in</div>
                            <div>
                                <h4 className="font-bold text-sm dark:text-white">LinkedIn</h4>
                                <p className="text-xs text-gray-500">Muy usado para perfiles corporativos, IT y finanzas.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="size-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center font-bold text-purple-600">I</div>
                            <div>
                                <h4 className="font-bold text-sm dark:text-white">Indeed.ch</h4>
                                <p className="text-xs text-gray-500">Buen agregador para todo tipo de trabajos.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                    <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined">badge</span>
                        Permisos de Trabajo
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        Como ciudadano de la UE (España), tienes derecho a trabajar.
                        <br />
                        <strong>Permiso L:</strong> Contratos de 3 meses a 1 año.
                        <br />
                        <strong>Permiso B:</strong> Contratos indefinidos o &gt; 1 año.
                        <br />
                        Tu empleador suele tramitarlo, pero tú debes registrarte en el municipio.
                    </p>
                </section>
            </div>
        </div>
    );
};
