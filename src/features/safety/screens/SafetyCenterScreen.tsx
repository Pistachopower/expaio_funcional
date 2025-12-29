import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InfoButton } from '../../../components';
import { geminiService } from '../../../lib/geminiService';

export const SafetyCenterScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [aiResult, setAiResult] = useState<{ text: string; link?: string; linkLabel?: string } | null>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setAiResult(null);
        try {
            const result = await geminiService.searchSafetyRisk(searchQuery);
            setAiResult(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col w-full pb-24 bg-background-light dark:bg-background-dark h-full overflow-y-auto animate-fade-in">
            <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <div className="w-full max-w-5xl mx-auto">
                    <div className="flex items-center p-4 pb-2 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary dark:text-[#19e691]">
                                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>shield_lock</span>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h2 className="text-lg font-bold leading-tight tracking-tight dark:text-white">Centro de Seguridad</h2>
                                    <InfoButton
                                        title="Tu Escudo en Suiza"
                                        text="Suiza es segura, pero los inmigrantes son blanco de estafas digitales. Aquí puedes verificar si un contrato de trabajo es real, si un piso es una estafa o buscar alertas recientes enviadas por la comunidad."
                                    />
                                </div>
                                <p className="text-xs text-[#638878] dark:text-gray-400 font-medium">Suiza • Seguro</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 pb-3">
                        <div className="flex w-full items-center rounded-lg h-12 bg-white dark:bg-card-dark shadow-sm border border-transparent focus-within:border-primary transition-all">
                            <button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="text-[#638878] dark:text-gray-400 flex items-center justify-center pl-4 pr-2 disabled:opacity-50 hover:text-primary transition-colors"
                            >
                                {isSearching ? (
                                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>refresh</span>
                                ) : (
                                    <span className="material-symbols-outlined" style={{ fontSize: 24 }}>search</span>
                                )}
                            </button>
                            <input
                                className="flex w-full bg-transparent border-none text-base font-normal text-[#111815] dark:text-white placeholder:text-[#638878] dark:placeholder:text-gray-500 focus:ring-0 focus:outline-none h-full"
                                placeholder="Buscar estafas o alertas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        {aiResult && (
                            <div className="mt-3 p-4 bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-xl flex gap-3 animate-fade-in shadow-sm">
                                <div className="shrink-0 pt-0.5">
                                    <span className="material-symbols-outlined text-primary filled" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[#111815] dark:text-gray-100 font-medium leading-relaxed">{aiResult.text}</p>
                                    {aiResult.link && (
                                        <Link to={aiResult.link} className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-primary hover:underline bg-white dark:bg-white/10 px-2 py-1 rounded-md border border-primary/20">
                                            {aiResult.linkLabel || 'Ver herramienta'}
                                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </Link>
                                    )}
                                </div>
                                <button onClick={() => setAiResult(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 self-start">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto pt-5">
                <div className="flex items-center justify-between px-4 pb-3">
                    <h2 className="text-[22px] font-bold leading-tight tracking-tight dark:text-white flex items-center gap-2">
                        Alertas Recientes
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    </h2>
                    <Link to="/offer-verifier" className="text-sm font-semibold text-primary hover:underline">Verificar Oferta</Link>
                </div>
                <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 gap-4 pb-4 md:grid md:grid-cols-2 md:overflow-visible">
                    <Link to="/offer-verifier" className="snap-center shrink-0 w-[85%] max-w-[320px] md:w-full md:max-w-none bg-white dark:bg-card-dark rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden flex flex-col hover:border-red-500/30 transition-colors">
                        <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://picsum.photos/seed/safety1/600/300')" }}>
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span> ALTA PRIORIDAD
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-base font-bold text-[#111815] dark:text-white leading-tight">Estafa SMS Swiss Post</h3>
                            <p className="text-sm text-[#638878] dark:text-gray-300">Los estafadores envían enlaces de "pago de aduanas".</p>
                        </div>
                    </Link>
                    <Link to="/housing-verification" className="snap-center shrink-0 w-[85%] max-w-[320px] md:w-full md:max-w-none bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:border-orange-500/30 transition-colors">
                        <div className="h-32 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://picsum.photos/seed/safety2/600/300')" }}>
                            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span> PRECAUCIÓN
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-base font-bold text-[#111815] dark:text-white leading-tight">Falsos Correos de Impuestos</h3>
                            <p className="text-sm text-[#638878] dark:text-gray-300">La oficina cantonal nunca pide detalles bancarios por email.</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="px-4 pt-4 w-full max-w-5xl mx-auto">
                <h2 className="text-[22px] font-bold leading-tight tracking-tight dark:text-white mb-4">Herramientas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link to="/calculator" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-start gap-3 text-left hover:border-primary/50 transition-colors group">
                        <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>calculate</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm dark:text-white">Calculadora Costos</h3>
                            <p className="text-xs text-[#638878] dark:text-gray-400 mt-1">Presupuesto real.</p>
                        </div>
                    </Link>
                    <Link to="/tax-guide" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-start gap-3 text-left hover:border-primary/50 transition-colors group">
                        <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>account_balance</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm dark:text-white">Impuestos</h3>
                            <p className="text-xs text-[#638878] dark:text-gray-400 mt-1">Quellensteuer guía.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
