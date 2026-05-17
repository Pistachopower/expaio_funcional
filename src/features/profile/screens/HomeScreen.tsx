import React from 'react';
import { Link } from 'react-router-dom';
import { InfoButton } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../../../lib/supabaseClient';
import { useRole } from '../../../hooks/useRole';

export const HomeScreen: React.FC = () => {
    const { profile, refreshProfile } = useAuth();
    const { isAdmin, isExpert, isMigrante } = useRole();
    const { userName, userPhoto } = useProfile(profile);
    const [countries, setCountries] = React.useState<any[]>([]);
    const [destinationCountry, setDestinationCountry] = React.useState<string | null>(null);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchCountries = async () => {
            const { data } = await supabase.from('paises').select('id, nombre');
            if (data) {
                setCountries(data);
                if (profile?.pais_destino_id) {
                    const country = data.find(c => c.id === profile.pais_destino_id);
                    if (country) setDestinationCountry(country.nombre);
                }
            }
        };
        fetchCountries();
    }, [profile?.pais_destino_id]);

    const handleCountryChange = async (countryId: string) => {
        if (!profile?.id || isUpdating) return;
        
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('perfiles')
                .update({ pais_destino_id: countryId })
                .eq('id', profile.id);
            
            if (error) throw error;
            
            await refreshProfile();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al cambiar de país:', error);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const bannerTitle = isExpert 
        ? "Impulsa tu Presencia" 
        : `Tu Viaje a ${destinationCountry || 'el Extranjero'} Empieza Aquí`;
    
    const bannerSubtitle = isExpert
        ? "Conecta con hispanohablantes que necesitan de tus servicios profesionales."
        : `Todo lo que necesitas para tu proceso de migración y establecimiento en ${destinationCountry || 'tu destino'}.`;

    return (
        <>
            <div className="flex flex-col h-full animate-fade-in w-full">
            <header className="px-6 pt-10 pb-6 w-full max-w-5xl mx-auto">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col gap-1">
                        {/* ExpaIO Logo & Branding */}
                        <div className="flex items-center gap-2 mb-1 opacity-90">
                            <div className="flex items-center justify-center size-6 bg-primary rounded-md shadow-sm shadow-primary/30">
                                <span className="material-symbols-outlined text-[#11211a] text-[18px] font-bold">all_inclusive</span>
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-[#111815] dark:text-white">ExpaIO</span>
                        </div>

                        {/* User Greeting */}
                        <h1 className="text-2xl font-normal text-[#638878] dark:text-gray-300">
                            Hola, <span className="font-bold text-[#111815] dark:text-white">{userName}</span> 👋
                        </h1>
                    </div>

                    <Link to="/profile" className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm mt-1 hover:scale-105 transition-transform">
                        <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                    </Link>
                </div>
            </header>

            <div className="px-4 space-y-6 w-full max-w-5xl mx-auto pb-24 md:pb-12">
                {/* Theme Hero Section */}
                <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <img src={isExpert ? "/expert_hero.png" : "/hero.png"} alt="Banner" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/hero.png"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                        <h2 className="text-white text-xl font-bold mb-1">
                            {bannerTitle}
                        </h2>
                        <p className="text-white/80 text-xs font-medium max-w-[250px]">
                            {bannerSubtitle}
                        </p>
                    </div>
                    <div className="absolute top-4 right-4 animate-bounce">
                        <div className="bg-white/20 backdrop-blur-md size-10 rounded-full flex items-center justify-center border border-white/30">
                            <span className="material-symbols-outlined text-white text-xl">
                                {isExpert ? "campaign" : "flight_takeoff"}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Custom Middle Section depending on Role */}
                {isExpert ? (
                    <Link to="/profile" className="flex flex-col bg-purple-600 rounded-2xl p-5 shadow-lg shadow-purple-600/25 relative overflow-hidden group transition-transform hover:scale-[1.01] active:scale-[0.99]">
                        <div className="absolute right-[-10px] top-[-10px] size-24 bg-white/20 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white">
                                    <span className="material-symbols-outlined text-2xl">person_search</span>
                                </div>
                                <span className="bg-white/90 text-purple-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm">Mi Perfil Público</span>
                            </div>
                            <h2 className="text-white text-xl font-bold leading-tight mb-1">Edita tu Portafolio</h2>
                            <p className="text-white/80 text-sm font-medium mb-3">Mantén tus datos de contacto actualizados para aparecer en el Directorio.</p>
                        </div>
                    </Link>
                ) : (
                    <Link to="/checklist" className="flex flex-col bg-primary rounded-2xl p-5 shadow-lg shadow-primary/25 relative overflow-hidden group transition-transform hover:scale-[1.01] active:scale-[0.99]">
                        <div className="absolute right-[-10px] top-[-10px] size-24 bg-white/20 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-[#11211a]">
                                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                                </div>
                                <span className="bg-white/90 text-[#11211a] text-xs font-bold px-2 py-1 rounded-md shadow-sm">Primeros Pasos</span>
                            </div>
                            <h2 className="text-[#11211a] text-xl font-bold leading-tight mb-1">Tu Checklist de Llegada</h2>
                            <p className="text-[#11211a]/80 text-sm font-medium mb-3">Organiza tus trámites esenciales.</p>
                            <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[33%]"></div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Destination Banner */}
                <div className="bg-white/40 dark:bg-card-dark/40 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3 flex justify-between items-center group">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-[#638878] font-bold mb-0.5">Destino actual</span>
                        <p className="text-sm font-bold text-[#111815] dark:text-white">{destinationCountry || 'Sin seleccionar'}</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-bold text-primary hover:underline transition-all"
                    >
                        {isUpdating ? 'Actualizando...' : 'Cambiar'}
                    </button>
                </div>

                {/* Emigrant Only Content */}
                {(isMigrante || isAdmin) && (

                    <>
                        {/* Quick Tools Grid */}
                        <div>
                            <div className="flex items-center mb-3 px-1">
                                <h3 className="text-[#111815] dark:text-white font-bold text-lg">Herramientas</h3>
                                <InfoButton
                                    title="Caja de Herramientas"
                                    text="Acceso directo a utilidades clave: calcula tu presupuesto, protege tus ahorros de estafas, encuentra servicios locales o consulta a nuestra IA especializada."
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Link to="/guia-inicial" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="size-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">menu_book</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Guía Inicial</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Primeros Pasos</p>
                                    </div>
                                </Link>
                                <Link to="/calculator" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">calculate</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Calculadora</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Costos de Vida</p>
                                    </div>
                                </Link>
                                <Link to="/safety" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">shield</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Seguridad</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Evitar Estafas</p>
                                    </div>
                                </Link>
                                <Link to="/directory" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">list_alt</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Directorio</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Servicios</p>
                                    </div>
                                </Link>
                                <Link to="/chat" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="size-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">smart_toy</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Asistente IA</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Ayuda 24/7</p>
                                    </div>
                                </Link>
                                
                                <Link to="/audios-integracion" className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors group">
                                    <div className="size-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>psychology</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Adaptación</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Mentalidad y Mente</p>
                                    </div>
                                </Link>
        
                            </div>
                        </div>

                        {/* Guides Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-3 px-1">
                                <div className="flex items-center">
                                    <h3 className="text-[#111815] dark:text-white font-bold text-lg">Guías Esenciales</h3>
                                    <InfoButton
                                        title="Manual de Supervivencia"
                                        text={`Información detallada y paso a paso sobre los pilares de la vida en ${destinationCountry || 'tu destino'}: obtención de trabajo, seguros, el sistema de impuestos y vivienda.`}
                                    />
                                </div>
                                <Link to="/directory" className="text-primary text-xs font-bold hover:underline">Ver más</Link>
                            </div>
                            {/* Use Grid on Desktop, Slider on Mobile */}
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x md:grid md:grid-cols-3 md:overflow-visible">
        
                                {/* Job Guide Link */}
                                <Link to="/guia/trabajo" className="snap-center shrink-0 w-64 md:w-full bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="size-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-orange-500 text-2xl">work</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Trabajo</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">CV y portales de empleo.</p>
                                    </div>
                                </Link>
        
                                <Link to="/guia/seguros" className="snap-center shrink-0 w-64 md:w-full bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="size-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-blue-500 text-2xl">medical_services</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Seguro Médico</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Trámites y coberturas.</p>
                                    </div>
                                </Link>
                                <Link to="/guia/impuestos" className="snap-center shrink-0 w-64 md:w-full bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="size-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-green-500 text-2xl">account_balance</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Impuestos</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Sistema fiscal y plazos.</p>
                                    </div>
                                </Link>
                                <Link to="/guia/alquiler" className="snap-center shrink-0 w-64 md:w-full bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="size-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-purple-500 text-2xl">home</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Vivienda</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Alquiler y requisitos.</p>
                                    </div>
                                </Link>
        
                                <Link to="/guia/vuelos" className="snap-center shrink-0 w-64 md:w-full bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="size-12 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-teal-500 text-2xl">flight</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#111815] dark:text-white">Transporte</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">Conexiones y movilidad.</p>
                                    </div>
                                </Link>
        
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Minimalist Country Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => !isUpdating && setIsModalOpen(false)}
                    ></div>
                    <div className="relative bg-white dark:bg-card-dark w-full max-w-sm rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-gray-100 dark:border-gray-800">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-[#111815] dark:text-white">Seleccionar destino</h3>
                            <button onClick={() => setIsModalOpen(false)} className="size-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                <span className="material-symbols-outlined text-gray-500">close</span>
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
                            {countries.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => handleCountryChange(c.id)}
                                    disabled={isUpdating}
                                    className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all flex justify-between items-center mb-1
                                        ${profile?.pais_destino_id === c.id 
                                            ? 'bg-primary/10 text-primary' 
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {c.nombre}
                                    {profile?.pais_destino_id === c.id && (
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        {isUpdating && (
                            <div className="absolute inset-0 bg-white/60 dark:bg-card-dark/60 backdrop-blur-[2px] flex items-center justify-center">
                                <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
