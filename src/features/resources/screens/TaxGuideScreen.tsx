import React, { useState } from 'react';
import { BackHeader } from '../../../components';

export const TaxGuideScreen: React.FC = () => {
    const [openTerm, setOpenTerm] = useState<string | null>(null);

    const toggleTerm = (term: string) => {
        setOpenTerm(openTerm === term ? null : term);
    };

    const GLOSSARY = [
        { id: '1', term: 'Quellensteuer (Impuesto en la Fuente)', def: 'Es el sistema por defecto para extranjeros sin permiso C. Tu empleador resta los impuestos directamente de tu salario mensual antes de pagarte. No tienes que "pagar" nada extra a fin de año, a menos que ganes más de 120,000 CHF.' },
        { id: '2', term: 'Ordentliche Besteuerung (Ordinaria)', def: 'El sistema para suizos y permiso C. Recibes tu salario completo y a final de año el estado te envía una factura (bastante grande) con los impuestos a pagar. Requiere mucha disciplina de ahorro.' },
        { id: '3', term: 'Efecto del Cantón', def: 'Cada cantón tiene un porcentaje diferente. Zug es famoso por ser muy bajo (aprox 10%), mientras que Berna o Vaud pueden llegar al 20-25% para el mismo salario.' },
        { id: '4', term: 'Lohnausweis', def: 'Certificado de salario anual que te da tu empleador en enero/febrero. Es el documento más importante para cualquier trámite fiscal.' },
    ];

    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader
                title="Guía Fiscal Suiza"
                showHelp={true}
                helpTitle="Sobre Impuestos"
                helpText="Suiza tiene un sistema federal donde los impuestos varían drásticamente según el cantón y el municipio donde vivas. Esta guía te explica los conceptos básicos que necesitas saber como extranjero."
            />

            <div className="flex flex-col gap-6 p-4">
                {/* Intro Section */}
                <section>
                    <h1 className="text-2xl font-bold text-[#111815] dark:text-white mb-2 leading-tight">Fiscalidad: ¿Dónde vives importa?</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        En Suiza no hay un "IRPF" nacional único. Pagas impuestos a tres niveles: Federal (bajo), Cantonal (medio) y Comunal (variable). Moverte 10km al pueblo de al lado puede ahorrarte miles de francos.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3">
                        <span className="material-symbols-outlined text-blue-500 shrink-0">info</span>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                            Si tienes <strong>Permiso B</strong>, casi seguro pagarás <strong>Quellensteuer</strong>. Esto simplifica mucho tu vida al principio.
                        </p>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Interactive Glossary */}
                    <section>
                        <h2 className="text-lg font-bold text-[#111815] dark:text-white mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">book</span>
                            Conceptos Clave
                        </h2>
                        <div className="flex flex-col gap-2">
                            {GLOSSARY.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleTerm(item.id)}
                                    className={`rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${openTerm === item.id
                                        ? 'bg-primary/5 border-primary/30 dark:bg-primary/10'
                                        : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-center p-4">
                                        <h3 className={`font-bold text-sm ${openTerm === item.id ? 'text-primary' : 'text-[#111815] dark:text-white'}`}>
                                            {item.term}
                                        </h3>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${openTerm === item.id ? 'rotate-180 text-primary' : ''}`}>
                                            expand_more
                                        </span>
                                    </div>
                                    <div className={`px-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${openTerm === item.id ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                                        {item.def}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comparison */}
                    <section>
                        <h2 className="text-lg font-bold text-[#111815] dark:text-white mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">map</span>
                            Ejemplo Práctico
                        </h2>
                        <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-500 mb-3">Salario Bruto Anual: 100,000 CHF (Soltero)</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Zúrich (Ciudad)</span>
                                    <span className="text-sm font-bold text-orange-500">~15.5%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-orange-400 h-full w-[60%]"></div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Zug (Ciudad)</span>
                                    <span className="text-sm font-bold text-green-500">~9.8%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[35%]"></div>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Lausanne (Vaud)</span>
                                    <span className="text-sm font-bold text-red-500">~21.0%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full w-[85%]"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
