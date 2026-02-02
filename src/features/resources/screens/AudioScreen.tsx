import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSignedAudioUrl } from '../../../api/repositories/AudioRepository';

const audioFiles = [
  {
    filename: '1_El_salto_hacia_ti_mismo.mp3',
    title: 'La barrera del idioma',
    description: 'Estrategias para el alemán y francés sin miedo.',
    duration: '4:45',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    filename: '2_Adaptars_no_es_perder_tu_identidad_es-ampliarla.mp3',
    title: 'Mi primer año en Berna',
    description: 'Gestionando las expectativas y la montaña rusa emocional.',
    duration: '6:15',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    filename: '3_Zurich_donde_la_disciplina_se_encuentra_con_la_calidad_de_vida.mp3',
    title: 'Proceso de planificación',
    description: 'Dominando la logística suiza.',
    duration: '5:30',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
    featured: true,
  },
  {
    filename: '4_El_idioma_no_es_un_muro_es_una_llave.mp3',
    title: 'El idioma no es un muro',
    description: 'El idioma como llave para nuevas oportunidades.',
    duration: '3:50',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
  },
];

const AudioScreen: React.FC = () => {
  const navigate = useNavigate();
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string | null }>({});
  const [audioDurations, setAudioDurations] = useState<{ [key: string]: number }>({});
  const [current, setCurrent] = useState<null | typeof audioFiles[0]>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUrls = async () => {
      setIsLoading(true);
      for (const file of audioFiles) {
        const url = await getSignedAudioUrl(file.filename);
        setAudioUrls((prev) => ({ ...prev, [file.filename]: url }));
        
        // Cargar duración real del audio
        if (url) {
          const tempAudio = new Audio(url);
          tempAudio.addEventListener('loadedmetadata', () => {
            setAudioDurations((prev) => ({ ...prev, [file.filename]: tempAudio.duration }));
          });
        }
      }
      setIsLoading(false);
    };
    loadUrls();
  }, []);

  useEffect(() => {
    if (audio) {
      audio.ontimeupdate = () => setProgress(audio.currentTime);
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.onended = () => {
        setIsPlaying(false);
        // Auto-play next
        nextAudio();
      };
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const playAudio = (file: typeof audioFiles[0]) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (audioUrls[file.filename]) {
      const newAudio = new window.Audio(audioUrls[file.filename]!);
      setAudio(newAudio);
      setCurrent(file);
      setIsPlaying(true);
      newAudio.play();
      newAudio.ontimeupdate = () => setProgress(newAudio.currentTime);
      newAudio.onloadedmetadata = () => setDuration(newAudio.duration);
      newAudio.onended = () => {
        setIsPlaying(false);
        nextAudio();
      };
    }
  };

  // Iniciar reproducción desde el primer audio
  const startPlaylist = () => {
    if (audioFiles.length > 0) {
      playAudio(audioFiles[0]);
    }
  };

  // Manejar click en un audio de la lista
  const handleAudioClick = (file: typeof audioFiles[0]) => {
    if (current) {
      // Si ya hay algo en reproducción, cambiar a ese audio o toggle play/pause
      if (current.filename === file.filename) {
        togglePlay();
      } else {
        playAudio(file);
      }
    } else {
      // Primera vez: iniciar desde el primer audio
      startPlaylist();
    }
  };

  // Manejar click en el featured/now playing card
  const handleFeaturedClick = () => {
    if (current) {
      togglePlay();
    } else {
      startPlaylist();
    }
  };

  const togglePlay = () => {
    if (!current) return;
    if (isPlaying) {
      pauseAudio();
    } else {
      if (audio) {
        audio.play();
        setIsPlaying(true);
      } else {
        playAudio(current);
      }
    }
  };

  const nextAudio = () => {
    if (!current) return;
    const idx = audioFiles.findIndex(f => f.filename === current.filename);
    const nextIdx = (idx + 1) % audioFiles.length;
    playAudio(audioFiles[nextIdx]);
  };

  const prevAudio = () => {
    if (!current) return;
    const idx = audioFiles.findIndex(f => f.filename === current.filename);
    const prevIdx = idx === 0 ? audioFiles.length - 1 : idx - 1;
    playAudio(audioFiles[prevIdx]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audio && duration) {
      const value = Number(e.target.value);
      audio.currentTime = value;
      setProgress(value);
    }
  };

  const pauseAudio = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const featured = audioFiles.find((a) => a.featured);

  function formatTime(secs: number) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Obtener la duración real o la estática como fallback
  const getRealDuration = (file: typeof audioFiles[0]) => {
    const realDuration = audioDurations[file.filename];
    if (realDuration) {
      return formatTime(realDuration);
    }
    return file.duration;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#0a0a0a] to-transparent pb-4">
        <div className="flex items-center justify-between px-4 pt-6 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold text-white">Integración</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto px-4 pb-48">
        {/* Now Playing / Featured */}
        {(() => {
          // Mostrar el audio en reproducción, o el featured si no hay nada reproduciéndose
          const displayAudio = current || featured;
          if (!displayAudio) return null;
          
          const isDisplayPlaying = current?.filename === displayAudio.filename && isPlaying;
          
          return (
            <div className="mb-6 animate-fade-in" key={displayAudio.filename}>
              <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-2 block">
                {current ? 'Reproduciendo' : 'Recomendado'}
              </span>
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={handleFeaturedClick}
              >
                <img
                  key={displayAudio.image}
                  src={displayAudio.image}
                  alt={displayAudio.title}
                  className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-widest mb-1">
                    {current ? 'En reproducción' : 'Lo más escuchado'}
                  </span>
                  <h2 className="text-xl font-bold text-white mb-1 leading-tight">{displayAudio.title}</h2>
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">{displayAudio.description}</p>
                  <div className="flex items-center gap-3">
                    <button
                      className="bg-orange-500 hover:bg-orange-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleFeaturedClick(); 
                      }}
                    >
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isDisplayPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <span className="text-xs text-white/50">{getRealDuration(displayAudio)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Audio List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white">Audio-Cápsulas</h3>
            <span className="text-xs text-white/40">{audioFiles.length} episodios</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-center bg-white/5 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full mr-4" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {audioFiles.map((file, index) => {
                const isActive = current?.filename === file.filename;
                const isCurrentPlaying = isActive && isPlaying;

                return (
                  <button
                    key={file.filename}
                    onClick={() => handleAudioClick(file)}
                    className={`flex items-center w-full text-left rounded-2xl p-3 transition-all duration-200
                      ${isActive
                        ? 'bg-orange-500/20 border border-orange-500/50'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                      }`}
                  >
                    {/* Number or Play indicator */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all
                      ${isActive ? 'bg-orange-500' : 'bg-white/10'}`}
                    >
                      {isCurrentPlaying ? (
                        <div className="flex items-center gap-[2px]">
                          <span className="w-[3px] h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="w-[3px] h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-[3px] h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : isActive ? (
                        <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                      ) : (
                        <span className="text-white/60 text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm truncate ${isActive ? 'text-orange-400' : 'text-white'}`}>
                        {file.title}
                      </div>
                      <div className="text-xs text-white/40 truncate">{file.description}</div>
                    </div>

                    {/* Duration */}
                    <div className="text-xs text-white/30 ml-2 shrink-0">{getRealDuration(file)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Player */}
      {current && (
        <div className="fixed left-0 right-0 bottom-[80px] sm:bottom-6 px-3 sm:px-0 z-50 animate-slide-up flex justify-center sm:pl-[200px]">
          <div className="w-full sm:w-[400px] sm:max-w-md bg-[#1c1c1e] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border border-white/10">
            {/* Progress bar top */}
            <div className="h-1 bg-white/10 w-full">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center p-3 gap-2">
              {/* Album art */}
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-lg">
                <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="flex items-center gap-[2px]">
                      <span className="w-[2px] h-3 bg-white rounded-full animate-pulse" />
                      <span className="w-[2px] h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="w-[2px] h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Info & progress */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-xs truncate">{current.title}</div>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <span className="w-7 shrink-0">{formatTime(progress)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={progress}
                    onChange={handleSeek}
                    className="flex-1 h-1 accent-orange-500 cursor-pointer min-w-0"
                    step={0.1}
                  />
                  <span className="w-7 shrink-0 text-right">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-0 shrink-0">
                <button
                  onClick={prevAudio}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">skip_previous</span>
                </button>
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button
                  onClick={nextAudio}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">skip_next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioScreen;
