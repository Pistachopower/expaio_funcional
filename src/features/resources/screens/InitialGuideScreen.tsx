import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { GuideRepository, CountryGuide } from '../../../api/repositories/GuideRepository';
import { BackHeader } from '../../../components';

export const InitialGuideScreen: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [guide, setGuide] = useState<CountryGuide | null>(null);
  const [destinationCountry, setDestinationCountry] = useState<string | null>(null);
  const [originCountry, setOriginCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      let targetName = 'tu destino';
      let sourceName = 'tu origen';
      
      try {
        // Fetch Target Name
        if (profile?.pais_destino_id) {
          const { data } = await supabase
            .from('paises')
            .select('nombre')
            .eq('id', profile.pais_destino_id)
            .single();
          if (data) targetName = data.nombre;
        }
        setDestinationCountry(targetName);

        // Fetch Origin Name
        if (profile?.pais_origen_id) {
          const { data } = await supabase
            .from('paises')
            .select('nombre')
            .eq('id', profile.pais_origen_id)
            .single();
          if (data) sourceName = data.nombre;
        }
        setOriginCountry(sourceName);

        // Fetch appropriate guide using priority logic
        const content = await GuideRepository.getGuideContent(
            profile?.pais_destino_id || null, 
            'inicial', 
            profile?.pais_origen_id || null
        );

        setGuide(content);
      } catch (err) {
        console.error("Error loading initial guide:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [profile?.pais_destino_id, profile?.pais_origen_id]);

  const toggleTerm = (termId: string) => {
    setOpenTerm(openTerm === termId ? null : termId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[#0f0f1a] items-center justify-center p-6">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col h-full bg-[#0f0f1a] p-6 animate-fade-in w-full max-w-2xl mx-auto">
        <header className="mb-8">
            <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Guía Inicial</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white/5 rounded-3xl border border-white/10">
          <span className="material-symbols-outlined text-gray-500 text-6xl mb-4">description_off</span>
          <h2 className="text-xl font-bold text-white mb-2">Información no disponible</h2>
          <p className="text-white/60 text-sm mb-6">Aún no tenemos guías preparadas para {destinationCountry}.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/10 text-white rounded-xl">Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0f1a] overflow-y-auto animate-fade-in w-full pb-20">
      <header className="px-6 pt-10 pb-6 w-full max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="size-10 rounded-full bg-white/5 flex items-center justify-center mb-6 hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold mb-4">
            <span className="material-symbols-outlined text-xs">public</span>
            {originCountry} → {destinationCountry}
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {guide.titulo}
        </h1>
        <p className="text-white/60 mt-2">
          {guide.subtitulo || `Guía personalizada para tu nueva vida en ${destinationCountry}.`}
        </p>
      </header>

      <div className="px-6 space-y-8 w-full max-w-2xl mx-auto">
        {/* Main Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-white/80 whitespace-pre-wrap leading-relaxed shadow-xl">
            {guide.contenido_markdown}
          </div>
        </div>

        {/* Dynamic Glossary */}
        {guide.glosario_json && guide.glosario_json.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">book</span>
              Conceptos Clave
            </h2>
            <div className="flex flex-col gap-3">
              {guide.glosario_json.map((item: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => toggleTerm(`term-${idx}`)}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${openTerm === `term-${idx}`
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                >
                  <div className="flex justify-between items-center p-4">
                    <h3 className={`font-bold text-sm ${openTerm === `term-${idx}` ? 'text-primary' : 'text-white'}`}>
                      {item.term}
                    </h3>
                    <span className={`material-symbols-outlined text-white/40 transition-transform duration-300 ${openTerm === `term-${idx}` ? 'rotate-180 text-primary' : ''}`}>
                      expand_more
                    </span>
                  </div>
                  <div className={`px-4 text-sm text-white/60 leading-relaxed transition-all duration-300 ${openTerm === `term-${idx}` ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                    {item.def || item.definition}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Call to Action */}
        <div className="p-6 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl border border-primary/20 flex flex-col items-center text-center gap-4 mb-8">
          <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
          </div>
          <div>
            <h3 className="text-white font-bold">¿Dudas sobre visas o trámites?</h3>
            <p className="text-white/60 text-xs mt-1">Nuestro asistente conoce los requisitos específicos para ciudadanos de {originCountry} en {destinationCountry}.</p>
          </div>
          <button 
            onClick={() => navigate('/chat')}
            className="w-full py-3 bg-primary text-[#11211a] font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:brightness-110"
          >
            Consultar Requisitos
          </button>
        </div>
      </div>
    </div>
  );
};
