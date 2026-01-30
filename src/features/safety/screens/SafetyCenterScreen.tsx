import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InfoButton } from '../../../components';
import { geminiService } from '../../../lib/geminiService';
import { supabase } from '../../../lib/supabaseClient';

interface SafetyAlert {
    id: string;
    title: string;
    description: string;
    details?: string;
    source?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    image_url?: string;
    link?: string;
}

interface SocialScamReport {
    id: string;
    platform: string;
    content: string;
    created_at: string;
    likes: number;
    user_id: string;
    profiles: {
        username: string;
        avatar_url: string;
    } | null;
}

const getRelevantImage = (title: string, description: string): string => {
    const text = (title + ' ' + description).toLowerCase();

    if (text.includes('phishing') || text.includes('banco') || text.includes('sms')) {
        return 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000'; // Hacker/Code
    }
    if (text.includes('paquete') || text.includes('correo') || text.includes('post')) {
        return 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=1000'; // Packages
    }
    if (text.includes('inversión') || text.includes('crypto') || text.includes('dinero')) {
        return 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000'; // Money/Crypto
    }
    if (text.includes('ceo') || text.includes('ejecutivo') || text.includes('empresa')) {
        return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000'; // Business meeting
    }
    if (text.includes('romance') || text.includes('amor') || text.includes('pareja')) {
        return 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&q=80&w=1000'; // Silhouette/Romance
    }
    if (text.includes('soporte') || text.includes('técnico') || text.includes('llamada')) {
        return 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1000'; // Call center
    }

    return 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000'; // Generic tech/security
};

export const SafetyCenterScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [aiResult, setAiResult] = useState<{ text: string; link?: string; linkLabel?: string } | null>(null);
    const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
    const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState<SafetyAlert | null>(null);
    const [communityReports, setCommunityReports] = useState<SocialScamReport[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // New state for reporting
    const [isReporting, setIsReporting] = useState(false);
    const [editingReport, setEditingReport] = useState<SocialScamReport | null>(null); // New state for editing
    const [newReportPlatform, setNewReportPlatform] = useState('WhatsApp');
    const [newReportContent, setNewReportContent] = useState('');
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
        fetchAlerts();
        fetchCommunityReports();
    }, []);

    const fetchAlerts = async () => {
        try {
            const { data, error } = await supabase
                .from('safety_alerts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAlerts(data || []);
        } catch (error) {
            console.error('Error fetching safety alerts:', error);
        } finally {
            setIsLoadingAlerts(false);
        }
    };

    const fetchCommunityReports = async () => {
        try {
            // Join with profiles table to get username and avatar
            const { data, error } = await supabase
                .from('community_reports')
                .select(`
                    *,
                    profiles:user_id (
                        username,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCommunityReports(data || []);
        } catch (error) {
            console.error('Error fetching community reports:', error);
        }
    };

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

    const handleSubmitReport = async () => {
        if (!newReportContent.trim()) return;

        setIsSubmittingReport(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('Debes iniciar sesión para reportar.');
                return;
            }

            if (editingReport) {
                // Update existing report
                const { error } = await supabase
                    .from('community_reports')
                    .update({
                        platform: newReportPlatform,
                        content: newReportContent,
                    })
                    .eq('id', editingReport.id);

                if (error) throw error;
            } else {
                // Create new report
                const { error } = await supabase
                    .from('community_reports')
                    .insert({
                        user_id: user.id,
                        platform: newReportPlatform,
                        content: newReportContent,
                    });

                if (error) throw error;
            }

            // Reset form and close modal
            handleCloseModal();

            // Refresh list
            fetchCommunityReports();

        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Error al enviar el reporte. Inténtalo de nuevo.');
        } finally {
            setIsSubmittingReport(false);
        }
    };

    const handleDeleteReport = async (reportId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres borrar este reporte?')) return;

        try {
            const { error } = await supabase
                .from('community_reports')
                .delete()
                .eq('id', reportId);

            if (error) throw error;
            fetchCommunityReports();
        } catch (error) {
            console.error('Error deleting report:', error);
            alert('Error al borrar el reporte.');
        }
    };

    const handleOpenEdit = (report: SocialScamReport) => {
        setEditingReport(report);
        setNewReportPlatform(report.platform);
        setNewReportContent(report.content);
        setIsReporting(true);
    };

    const handleCloseModal = () => {
        setIsReporting(false);
        setEditingReport(null);
        setNewReportContent('');
        setNewReportPlatform('WhatsApp');
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-red-600';
            case 'HIGH': return 'bg-red-500';
            case 'MEDIUM': return 'bg-orange-500';
            default: return 'bg-blue-500';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'gavel';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'error';
            default: return 'info';
        }
    };

    // Filter alerts based on search query
    const filteredAlerts = alerts.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                {isLoadingAlerts ? (
                    <div className="flex px-4 gap-4 overflow-x-auto no-scrollbar">
                        {[1, 2].map(i => (
                            <div key={i} className="shrink-0 w-[85%] max-w-[320px] h-64 bg-gray-100 dark:bg-card-dark rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredAlerts.length > 0 ? (
                    <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 gap-4 pb-4 md:grid md:grid-cols-2 md:overflow-visible">
                        {filteredAlerts.map((alert) => (
                            <button
                                key={alert.id}
                                onClick={() => setSelectedAlert(alert)}
                                className="snap-center shrink-0 w-[85%] max-w-[320px] md:w-full md:max-w-none bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:border-primary/30 transition-colors text-left"
                            >
                                <div
                                    className="h-32 w-full bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url('${alert.image_url || getRelevantImage(alert.title, alert.description)}')` }}
                                >
                                    <div className={`absolute top-3 left-3 ${getPriorityColor(alert.priority)} text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1`}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{getPriorityIcon(alert.priority)}</span>
                                        {alert.priority}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <h3 className="text-base font-bold text-[#111815] dark:text-white leading-tight">{alert.title}</h3>
                                    <p className="text-sm text-[#638878] dark:text-gray-300 line-clamp-2">{alert.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-4xl mb-2">{searchQuery ? 'search_off' : 'check_circle'}</span>
                        <p>{searchQuery ? 'No se encontraron alertas con ese término.' : 'No hay alertas activas en este momento. ¡Sigue así!'}</p>
                    </div>
                )}
            </div>

            {/* Reported Scams Section */}
            <div className="w-full max-w-5xl mx-auto pt-2 pb-6 px-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[22px] font-bold leading-tight tracking-tight dark:text-white flex items-center gap-2">
                        Reportes de la Comunidad
                        <span className="material-symbols-outlined text-blue-500" style={{ fontSize: 24 }}>groups</span>
                    </h2>
                    <button
                        onClick={() => setIsReporting(true)}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Reportar
                    </button>
                </div>

                {communityReports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {communityReports.map(scam => (
                            <div key={scam.id} className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={scam.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${scam.profiles?.username || 'User'}&background=random`}
                                        alt={scam.profiles?.username || 'User'}
                                        className="size-10 rounded-full bg-gray-200 object-cover"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-[#111815] dark:text-white">
                                                {scam.profiles?.username || 'Usuario Anónimo'}
                                            </p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${scam.platform === 'Facebook' ? 'bg-blue-100 text-blue-700' :
                                                scam.platform === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                                                    scam.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {scam.platform}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {new Date(scam.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug mb-3">
                                    "{scam.content}"
                                </p>
                                <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                                    <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">favorite</span>
                                        {scam.likes || 0}
                                    </div>
                                    <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                                        Comentar
                                    </div>
                                    <div className="ml-auto flex items-center gap-1">
                                        {currentUser && currentUser.id === scam.user_id && (
                                            <div className="flex items-center gap-2 mr-3 border-r border-gray-200 dark:border-gray-700 pr-3">
                                                <button
                                                    onClick={() => handleOpenEdit(scam)}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReport(scam.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Borrar"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 hover:text-gray-600 cursor-pointer transition-colors">
                                            <span className="material-symbols-outlined text-[16px]">share</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white dark:bg-card-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">campaign</span>
                        <p className="text-gray-500 dark:text-gray-400">Aún no hay reportes de la comunidad.</p>
                        <button
                            onClick={() => setIsReporting(true)}
                            className="mt-2 text-primary font-semibold hover:underline"
                        >
                            ¡Sé el primero en reportar!
                        </button>
                    </div>
                )}
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

            {/* Detail Alert Modal */}
            {selectedAlert && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedAlert(null)}>
                    <div
                        className="bg-white dark:bg-card-dark w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image Header */}
                        <div className="relative h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url('${selectedAlert.image_url || getRelevantImage(selectedAlert.title, selectedAlert.description)}')` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <button
                                onClick={() => setSelectedAlert(null)}
                                className="absolute top-4 right-4 size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className={`inline-flex ${getPriorityColor(selectedAlert.priority)} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg items-center gap-1.5 mb-3`}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{getPriorityIcon(selectedAlert.priority)}</span>
                                    {selectedAlert.priority}
                                </div>
                                <h2 className="text-2xl font-bold text-white leading-tight">{selectedAlert.title}</h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{selectedAlert.description}</p>

                            {selectedAlert.details && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-[#111815] dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">shield</span>
                                        Cómo Protegerte
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
                                        {selectedAlert.details.split('\n').map((line, idx) => {
                                            const trimmedLine = line.trim();
                                            if (!trimmedLine) return null;

                                            // Check if it's a bullet point
                                            const isBullet = trimmedLine.startsWith('*') || trimmedLine.startsWith('-');
                                            const isSubBullet = trimmedLine.match(/^\s{2,}\*/);

                                            if (isBullet || isSubBullet) {
                                                const text = trimmedLine.replace(/^[\s*-]+/, '').trim();
                                                const isBold = text.includes('**');
                                                const cleanText = text.replace(/\*\*/g, '');

                                                return (
                                                    <div key={idx} className={`flex gap-3 ${isSubBullet ? 'ml-6' : ''}`}>
                                                        <span className="text-primary mt-1 shrink-0">•</span>
                                                        <p className={`text-sm ${isBold ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'} leading-relaxed`}>
                                                            {cleanText}
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <p key={idx} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                    {trimmedLine}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Source Citation */}
                            {selectedAlert.source && (
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>
                                        <div>
                                            <span className="font-semibold">Fuente: </span>
                                            <span>{selectedAlert.source}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3">
                                <Link
                                    to="/offer-verifier"
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>verified_user</span>
                                    Verificar Oferta hola
                                </Link>
                                <button
                                    onClick={() => setSelectedAlert(null)}
                                    className="px-6 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {isReporting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={handleCloseModal}>
                    <div
                        className="bg-white dark:bg-card-dark w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500">warning</span>
                                {editingReport ? 'Editar Reporte' : 'Reportar Estafa'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Plataforma</label>
                                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                    {['WhatsApp', 'Facebook', 'Instagram', 'Otro'].map(platform => (
                                        <button
                                            key={platform}
                                            onClick={() => setNewReportPlatform(platform)}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${newReportPlatform === platform
                                                ? 'bg-white dark:bg-card-dark text-primary shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    Descripción
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={newReportContent}
                                    onChange={(e) => setNewReportContent(e.target.value)}
                                    placeholder="¿Qué pasó? Describe la estafa, el número de teléfono o el perfil..."
                                    className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none dark:text-white"
                                />
                            </div>

                            <button
                                onClick={handleSubmitReport}
                                disabled={isSubmittingReport || !newReportContent.trim()}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmittingReport ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin" style={{ fontSize: 20 }}>refresh</span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                                        {editingReport ? 'Actualizar' : 'Enviar Reporte'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
