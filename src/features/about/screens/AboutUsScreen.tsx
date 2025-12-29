import React, { useState } from 'react';
import { BackHeader } from '../../../components';

export const AboutUsScreen: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "¿Es la aplicación gratuita?",
            a: "Sí, ExpaIO es y será siempre gratuita para todos los que buscan empezar una nueva vida en Suiza. Creemos en el acceso libre a la información de integración."
        },
        {
            q: "¿De dónde viene la información?",
            a: "Nuestra base de datos se nutre de fuentes oficiales del gobierno federal suizo (admin.ch), oficinas cantonales y, lo más importante, de la experiencia real de inmigrantes españoles que ya viven aquí."
        },
        {
            q: "¿Cómo ayuda la IA?",
            a: "Utilizamos Google Gemini para procesar tus dudas en lenguaje natural. La IA está entrenada específicamente con guías de integración suizas para darte respuestas precisas y seguras."
        },
        {
            q: "¿Mis datos están seguros?",
            a: "Absolutamente. Solo pedimos los datos mínimos necesarios para personalizar tus guías y nunca los vendemos a terceros. Usamos Supabase para un almacenamiento cifrado de nivel empresarial."
        }
    ];

    const developers = [
        {
            name: "Héctor Martínez Cornejo",
            role: "Fullstack Developer",
            avatar: "👨‍💻",
            desc: "Apasionado por crear herramientas que resuelvan problemas reales de movilidad humana."
        },
        {
            name: "Nelson Galicia Carrero",
            role: "Fullstack Developer",
            avatar: "👨‍💻",
            desc: "Apasionado por crear herramientas que resuelvan problemas reales de movilidad humana."
        },
        {
            name: "Team ExpaIO",
            role: "Content & Design",
            avatar: "🚀",
            desc: "Expertos en integración suiza trabajando para que tu aterrizaje sea lo más suave posible."
        }
    ];

    return (
        <div className="flex h-full w-full flex-col bg-background-light dark:bg-background-dark animate-fade-in overflow-y-auto pb-24 max-w-5xl mx-auto">
            <BackHeader title="Sobre Nosotros" />

            <div className="p-6 flex flex-col items-center text-center">
                <div className="size-20 bg-primary rounded-3xl shadow-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white text-5xl">all_inclusive</span>
                </div>
                <h1 className="text-3xl font-extrabold text-[#111815] dark:text-white mb-2 italic">ExpaIO</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Nacimos con la misión de simplificar el salto a Suiza para la comunidad hispanohablante, combinando tecnología de vanguardia con experiencia humana real.
                </p>
            </div>

            <section className="px-6 py-8">
                <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    El Equipo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {developers.map((dev, i) => (
                        <div key={i} className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 hover:border-primary/30 transition-all group">
                            <div className="size-16 rounded-full bg-gray-50 dark:bg-surface-dark flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                {dev.avatar}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold dark:text-white leading-tight">{dev.name}</h3>
                                <p className="text-sm text-primary font-semibold mb-2">{dev.role}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{dev.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 py-8">
                <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">quiz</span>
                    Preguntas Frecuentes
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between py-2 text-left group"
                            >
                                <span className={`text-base font-bold transition-colors ${openIndex === i ? 'text-primary' : 'text-[#111815] dark:text-white group-hover:text-primary/70'}`}>
                                    {faq.q}
                                </span>
                                <span className={`material-symbols-outlined transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-primary' : 'text-gray-400'}`}>
                                    expand_more
                                </span>
                            </button>
                            {openIndex === i && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed animate-fade-in pl-1">
                                    {faq.a}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-10 text-center">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                    Hecho con ❤️ en Zúrich • ExpaIO v1.0.0
                </p>
            </div>
        </div>
    );
};
