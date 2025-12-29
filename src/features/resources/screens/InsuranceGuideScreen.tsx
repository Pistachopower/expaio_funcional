import React, { useState } from 'react';
import { BackHeader } from '../../../components';

export const InsuranceGuideScreen: React.FC = () => {
    const [activeProfile, setActiveProfile] = useState<'Trabajador' | 'Estudiante' | 'Familia'>('Trabajador');

    return (
        <div className="relative flex h-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in w-full max-w-5xl mx-auto">
            <BackHeader
                title="Seguro Médico (KVG)"
                showHelp={true}
                helpTitle="Seguridad Social"
                helpText="El seguro de salud en Suiza es privado pero obligatorio para todos los residentes. Tienes libertad para elegir compañía y modelo de cobertura, pero es fundamental entender los plazos y las franquicias."
            />

            <div className="p-4 space-y-4">
                <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-[#111815] dark:text-white mb-2">Obligatorio para todos</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        El seguro básico (Grundversicherung) es obligatorio por ley. Tienes 3 meses desde tu llegada para contratarlo (es retroactivo, pagarás los 3 meses de golpe si tardas).
                    </p>
                </div>

                <div className="flex gap-2 bg-gray-100 dark:bg-card-dark p-1 rounded-xl">
                    {(['Trabajador', 'Estudiante', 'Familia'] as const).map(profile => (
                        <button
                            key={profile}
                            onClick={() => setActiveProfile(profile)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeProfile === profile ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {profile}
                        </button>
                    ))}
                </div>

                <div className="animate-fade-in">
                    {activeProfile === 'Trabajador' && (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border-l-4 border-primary">
                                <h3 className="font-bold text-[#111815] dark:text-white">Perfil: Trabajador</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Si trabajas más de 8 horas a la semana, tu empleador YA cubre los accidentes (laborales y no laborales).
                                </p>
                                <div className="mt-3 bg-primary/10 p-2 rounded text-xs font-bold text-primary-dark dark:text-primary">
                                    Tip: Elimina la cobertura de "Accidentes" de tu seguro médico privado para ahorrar un 10-15%.
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-2 dark:text-white">Recomendaciones:</h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>• <strong>Modelo Telmed:</strong> El más barato. Llamas antes de ir al médico.</li>
                                    <li>• <strong>Franquicia 2500 CHF:</strong> Si eres sano y vas poco al médico, ahorras mucho en la cuota mensual.</li>
                                    <li>• <strong>Aseguradoras Populares:</strong> Sanitas (buena app en inglés), Swica (buen servicio), Assura (muy barata, servicio básico).</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeProfile === 'Estudiante' && (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border-l-4 border-blue-500">
                                <h3 className="font-bold text-[#111815] dark:text-white">Perfil: Estudiante</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Los seguros normales son muy caros para estudiantes. Existen opciones especiales aprobadas por los cantones para estudiantes extranjeros.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                    <h4 className="font-bold text-blue-700 dark:text-blue-300 text-sm">Swisscare / Scorestudies</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Ofrecen tarifas desde ~65-100 CHF/mes (vs los 300+ CHF normales). Debes solicitar la "exención" en tu cantón con el certificado que te dan.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-card-dark p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                                    <h4 className="font-bold text-sm dark:text-white">Requisitos</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Tener carnet de estudiante válido, no trabajar (o muy poco) y ser menor de 30 años generalmente.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeProfile === 'Familia' && (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border-l-4 border-green-500">
                                <h3 className="font-bold text-[#111815] dark:text-white">Perfil: Familia</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Los niños pagan primas reducidas. Es crucial revisar los descuentos por "paquete familiar".
                                </p>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li>• <strong>Franquicia Niños:</strong> Suele ser 0 CHF. Pagan el 10% de lo que gasten hasta un tope.</li>
                                <li>• <strong>Dental:</strong> El seguro básico NO cubre dentista. Para niños, es vital contratar un complementario dental muy pronto (antes de los 5 años) para evitar chequeos previos.</li>
                                <li>• <strong>Subsidios:</strong> Si los ingresos familiares son bajos, el cantón ofrece subsidios (Prämienverbilligung). ¡Solicítalo!</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
