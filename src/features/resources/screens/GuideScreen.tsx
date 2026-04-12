import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackHeader } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { GuideRepository, CountryGuide } from '../../../api/repositories/GuideRepository';
import { supabase } from '../../../lib/supabaseClient';

export const GuideScreen: React.FC = () => {
    const { tipo } = useParams<{ tipo: string }>();
    const { profile } = useAuth();
    const [guide, setGuide] = useState<CountryGuide | null>(null);
    const [countryName, setCountryName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [openTerm, setOpenTerm] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (!profile?.pais_destino_id || !tipo) {
                setIsLoading(false);
                return;
            }

            // Fetch Country Name
            const { data: countryData } = await supabase
                .from('paises')
                .select('nombre')
                .eq('id', profile.pais_destino_id)
                .single();
            
            if (countryData) setCountryName(countryData.nombre);

            // Fetch Guide Content
            const content = await GuideRepository.getGuideContent(profile.pais_destino_id, tipo);
            setGuide(content);
            setIsLoading(false);
        };

        fetchContent();
    }, [profile?.pais_destino_id, tipo]);

    const toggleTerm = (termId: string) => {
        setOpenTerm(openTerm === termId ? null : termId);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark w-full max-w-5xl mx-auto p-4 text-center justify-center">
                <BackHeader title="Guía no encontrada" />
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">description_off</span>
                <h2 className="text-xl font-bold dark:text-white">Aún no tenemos información sobre "{tipo}" en {countryName || 'tu destino'}.</h2>
                <p className="text-gray-500 mt-2">Estamos trabajando para añadir más contenido global pronto.</p>
            </div>
        );
    }

    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader
                title={`${guide.titulo} - ${countryName}`}
                showHelp={true}
                helpTitle={`Sobre ${guide.titulo}`}
                helpText={guide.subtitulo || `Esta guía te muestra lo esencial sobre ${tipo} en ${countryName}.`}
            />

            <div className="flex flex-col gap-6 p-4">
                <section>
                    <h1 className="text-2xl font-bold text-[#111815] dark:text-white mb-2 leading-tight">{guide.titulo}</h1>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        {/* Basic Markdown rendering or simple text for now */}
                        <p className="whitespace-pre-wrap">{guide.contenido_markdown}</p>
                    </div>
                </section>

                {guide.glosario_json && guide.glosario_json.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-[#111815] dark:text-white mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">book</span>
                            Conceptos Clave
                        </h2>
                        <div className="flex flex-col gap-2">
                            {guide.glosario_json.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleTerm(`term-${idx}`)}
                                    className={`rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${openTerm === `term-${idx}`
                                        ? 'bg-primary/5 border-primary/30 dark:bg-primary/10'
                                        : 'bg-white dark:bg-card-dark border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-center p-4">
                                        <h3 className={`font-bold text-sm ${openTerm === `term-${idx}` ? 'text-primary' : 'text-[#111815] dark:text-white'}`}>
                                            {item.term}
                                        </h3>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${openTerm === `term-${idx}` ? 'rotate-180 text-primary' : ''}`}>
                                            expand_more
                                        </span>
                                    </div>
                                    <div className={`px-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${openTerm === `term-${idx}` ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                                        {item.def}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
