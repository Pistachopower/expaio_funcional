import React, { useState } from 'react';
import { BackHeader } from '../../../components';

export const RentGuideScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Estudiante' | 'Familia' | 'Mascotas'>('Estudiante');

    const PORTALS = [
        { name: 'Homegate', desc: 'El más grande. Todo tipo de pisos.', url: 'homegate.ch' },
        { name: 'Flatfox', desc: 'Muy popular, chat directo, sin fianza a veces.', url: 'flatfox.ch' },
        { name: 'ImmoScout24', desc: 'Clásico, muchas opciones.', url: 'immoscout24.ch' },
        { name: 'WG Zimmer', desc: 'El rey para habitaciones compartidas.', url: 'wgzimmer.ch' },
        { name: 'Ron Orp', desc: 'Newsletter local, joyas ocultas urbanas.', url: 'ronorp.net' }
    ];

    return (
        <div className="relative flex h-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-24 overflow-y-auto animate-fade-in w-full max-w-5xl mx-auto">
            <BackHeader
                title="Guía de Alquiler"
                showHelp={true}
                helpTitle="Vivienda en Suiza"
                helpText="Alquilar en Suiza es un proceso competitivo que requiere un dossier impecable. Aquí te exploramos los portales más importantes, las reglas de convivencia y los requisitos según tu situación familiar."
            />

            <div className="p-4 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-[#111815] dark:text-white leading-tight">El mercado más difícil</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        En ciudades como Zúrich o Ginebra, hay colas de 50 personas para un piso. La preparación de tu "Dossier" es clave.
                    </p>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Requisitos por Perfil</h3>
                    <div className="flex gap-2 bg-gray-100 dark:bg-card-dark p-1 rounded-xl mb-4">
                        {(['Estudiante', 'Familia', 'Mascotas'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 animate-fade-in">
                        {activeTab === 'Estudiante' && (
                            <>
                                <h4 className="font-bold text-primary mb-2">Para Estudiantes / Jóvenes</h4>
                                <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li><strong>Garante:</strong> Al no tener ingresos altos, a menudo piden que tus padres (incluso si viven fuera) firmen como garantes solidarios.</li>
                                    <li><strong>WOKO / JUWO:</strong> En Zúrich, busca estas cooperativas. Son pisos solo para estudiantes, mucho más baratos.</li>
                                    <li><strong>WG (Wohngemeinschaft):</strong> Compartir piso es la norma. Usa <em>wgzimmer.ch</em>. Se hacen "castings" para entrar.</li>
                                </ul>
                            </>
                        )}
                        {activeTab === 'Familia' && (
                            <>
                                <h4 className="font-bold text-primary mb-2">Para Familias</h4>
                                <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li><strong>Regla de Ocupación:</strong> Muchas agencias exigen (Nº Habitaciones) &gt; (Nº Personas - 1). Ej: 3 personas necesitan mínimo 2.5 o 3 habitaciones.</li>
                                    <li><strong>Ruido:</strong> Suiza es estricta con el ruido. Las horas de silencio (22:00 - 07:00) son sagradas.</li>
                                    <li><strong>Cerca de Escuelas:</strong> Busca "Kindergarten" cerca. Los niños van andando solos desde muy pequeños.</li>
                                </ul>
                            </>
                        )}
                        {activeTab === 'Mascotas' && (
                            <>
                                <h4 className="font-bold text-primary mb-2">Con Mascotas</h4>
                                <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li><strong>Permiso Explícito:</strong> El contrato debe decir "Se permiten animales". Si no lo dice, pregunta ANTES de firmar.</li>
                                    <li><strong>Seguro RC:</strong> Tu seguro de responsabilidad civil debe cubrir daños por mascotas (Privathaftpflicht).</li>
                                    <li><strong>Gatos:</strong> Si es planta baja, suelen pedir instalar gateras (y luego tendrás que restaurar la ventana al irte).</li>
                                </ul>
                            </>
                        )}
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Mejores Portales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PORTALS.map((portal) => (
                            <a
                                key={portal.name}
                                href={`https://${portal.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col bg-white dark:bg-card-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-[#111815] dark:text-white">{portal.name}</span>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary text-sm">open_in_new</span>
                                </div>
                                <span className="text-xs text-gray-500">{portal.desc}</span>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
