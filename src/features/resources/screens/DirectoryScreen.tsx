import React, { useState, useEffect } from 'react';
import { BackHeader, InfoButton } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';

interface DirectoryItem {
    id: string;
    name: string;
    type: 'Medical' | 'Legal' | 'Education' | 'Other';
    tag: string;
    location: string;
    description: string;
    image: string;
    verified: boolean;
    phoneNumber?: string;
    email?: string;
    website?: string;
}

const DIRECTORY_ITEMS: DirectoryItem[] = [
    {
        id: '1',
        name: 'Cruz Roja Suiza',
        type: 'Medical',
        tag: 'Humanitario',
        location: 'Zürich / Nacional',
        description: 'Ayuda humanitaria, integración y soporte médico. Servicios específicos para migrantes.',
        image: 'https://www.redcross.ch/sites/default/files/styles/16_9_1920_1080/public/2021-02/srk_logo_cmyk.png?h=3e2d6706&itok=B1u3fQ4_',
        verified: true,
        phoneNumber: '044 388 25 25',
        email: 'info@srk-zuerich.ch',
        website: 'https://www.srk-zuerich.ch'
    },
    {
        id: '2',
        name: 'Freiplatzaktion Zürich',
        type: 'Legal',
        tag: 'Legal Gratuito',
        location: 'Zürich',
        description: 'Asesoramiento jurídico gratuito y representación para refugiados y migrantes. Hablan español.',
        image: 'https://freiplatzaktion.ch/wp-content/uploads/2020/09/Logo_Freiplatzaktion_Zuerich.png',
        verified: true,
        phoneNumber: '044 245 54 20',
        email: 'info@freiplatzaktion.ch',
        website: 'https://freiplatzaktion.ch'
    },
    {
        id: '3',
        name: 'Infodona / Info-Desk',
        type: 'Other',
        tag: 'Asesoría',
        location: 'Zürich',
        description: 'Servicio municipal de asesoría para migrantes en español. Ayuda con permisos, familia y trabajo.',
        image: 'https://www.stadt-zuerich.ch/content/dam/stzh/portal/images/logos/stadt-zuerich-logo.svg',
        verified: true,
        phoneNumber: '044 412 84 00',
        website: 'https://www.stadt-zuerich.ch/integrationsfoerderung'
    },
    {
        id: '4',
        name: 'CCSI Genève',
        type: 'Legal',
        tag: 'Apoyo Migrante',
        location: 'Genève',
        description: 'Centro de Contacto Suizos-Inmigrantes. Defensa de derechos y apoyo social en español.',
        image: 'https://ccsi.ch/wp-content/themes/ccsi/img/logo.png',
        verified: true,
        phoneNumber: '022 304 48 60',
        email: 'info@ccsi.ch',
        website: 'https://ccsi.ch'
    },
    {
        id: '5',
        name: 'Latinas en Suiza',
        type: 'Other',
        tag: 'Comunidad',
        location: 'Online / Nacional',
        description: 'Plataforma de apoyo, conexión y empoderamiento para mujeres latinoamericanas en Suiza.',
        image: 'https://latinasensuiza.ch/wp-content/uploads/2021/04/Logo-Latinas-en-Suiza-1.png',
        verified: true,
        email: 'hola@latinasensuiza.ch',
        website: 'https://latinasensuiza.ch'
    },
    {
        id: '6',
        name: 'Caritas Suiza',
        type: 'Other',
        tag: 'Ayuda Social',
        location: 'Luzern / Nacional',
        description: 'Apoyo a personas en situación de pobreza y refugiados. Consultas sociales y jurídicas.',
        image: 'https://www.caritas.ch/assets/images/logo/caritas_logo.svg',
        verified: true,
        phoneNumber: '041 419 22 22',
        email: 'info@caritas.ch',
        website: 'https://www.caritas.ch'
    },
    {
        id: '7',
        name: 'Acoge Zúrich',
        type: 'Other',
        tag: 'Integración',
        location: 'Zürich',
        description: 'Acompañamiento voluntario para la integración de hispanohablantes recién llegados.',
        image: 'https://acoge.ch/wp-content/uploads/2021/05/logo-acoge-1.png',
        verified: true,
        email: 'info@acoge.ch',
        website: 'https://acoge.ch'
    },
    {
        id: '8',
        name: 'HSS Group',
        type: 'Legal',
        tag: 'Administrativo',
        location: 'Bern / Online',
        description: 'Agencia hispano-suiza. Asesoramiento legal, seguros, impuestos y trámites administrativos.',
        image: 'https://hssgroup.ch/wp-content/uploads/2020/06/Logo-HSS-Group.png',
        verified: true,
        phoneNumber: '031 351 44 44',
        email: 'info@hssgroup.ch',
        website: 'https://hssgroup.ch'
    }
];

export const DirectoryScreen: React.FC = () => {
    const { profile } = useAuth();
    const [items, setItems] = useState<DirectoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'Todos' | 'Legal' | 'Medical' | 'Education' | 'Other'>('Todos');
    const [destinationName, setDestinationName] = useState('Suiza');

    useEffect(() => {
        const fetchDirectory = async () => {
            if (!profile?.pais_destino_id) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch Country Name
                const { data: country } = await supabase
                    .from('paises')
                    .select('nombre')
                    .eq('id', profile.pais_destino_id)
                    .single();
                if (country) setDestinationName(country.nombre);

                // Fetch ONG Directory Items
                const { data, error } = await supabase
                    .from('directorio')
                    .select('*')
                    .eq('pais_id', profile.pais_destino_id);

                if (error) throw error;

                // Empezar con el mapeo de los items estáticos/Directorio normal
                let allItems: DirectoryItem[] = [];

                if (data) {
                    const mappedItems: DirectoryItem[] = data.map(item => ({
                        id: item.id,
                        name: item.nombre,
                        type: item.tipo ? (item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)) as any : 'Other',
                        tag: item.tag,
                        location: item.ubicacion,
                        description: item.descripcion,
                        image: item.imagen_url || 'https://ui-avatars.com/api/?name=' + item.nombre,
                        verified: item.verificado,
                        phoneNumber: item.telefono,
                        email: item.email,
                        website: item.sitio_web
                    }));
                    allItems = [...allItems, ...mappedItems];
                }

                // NUEVO: Fetch Live Experts (Profesores, Abogados) aprobados
                const { data: expertosData } = await supabase
                    .from('expertos')
                    .select('usuario_id, biografia')
                    .eq('aprobado', true);

                if (expertosData && expertosData.length > 0) {
                    const userIds = expertosData.map(e => e.usuario_id);
                    
                    const { data: perfilesData } = await supabase
                        .from('perfiles')
                        .select('id, nombre, apellido, rol, telefono, idioma_preferido, pais_destino_id')
                        .in('id', userIds)
                        .eq('pais_destino_id', profile.pais_destino_id);
                        
                    if (perfilesData) {
                        const expertItems: DirectoryItem[] = perfilesData.map(perf => {
                            const extData = expertosData.find(e => e.usuario_id === perf.id);
                            
                            // Map roles to types
                            let itemType: 'Education' | 'Legal' | 'Other' = 'Other';
                            if (perf.rol === 'profesor') itemType = 'Education';
                            if (perf.rol === 'abogado') itemType = 'Legal';

                            return {
                                id: perf.id,
                                name: `${perf.nombre} ${perf.apellido}`,
                                type: itemType,
                                tag: perf.rol === 'profesor' ? `Profesor de ${perf.idioma_preferido || 'Idiomas'}` : perf.rol.toUpperCase(),
                                location: 'Especialista Verificado',
                                description: extData?.biografia || `Ofrece sus servicios como ${perf.rol}. ¡Contacta para más información!`,
                                image: `https://ui-avatars.com/api/?name=${perf.nombre}+${perf.apellido}&background=random`,
                                verified: true, // They are approved real users
                                phoneNumber: perf.telefono,
                                email: '' // Si tuvieran perfil público de email podríamos colocarlo
                            };
                        });
                        allItems = [...allItems, ...expertItems];
                    }
                }

                setItems(allItems);

            } catch (err) {
                console.error('Error fetching directory:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDirectory();
    }, [profile?.pais_destino_id]);

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tag.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === 'Todos' || item.type === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-y-auto animate-fade-in w-full max-w-5xl mx-auto">
            <BackHeader title={`Directorio en ${destinationName}`} />
            <div className="bg-surface-light dark:bg-surface-dark px-4 pb-4 pt-2">
                <div className="flex items-center mb-4">
                    <h1 className="text-[#111815] dark:text-white tracking-tight text-[26px] font-bold leading-tight text-left">Directorio {destinationName}</h1>
                    <InfoButton
                        title="Directorio de Contactos"
                        text="Una lista curada de organizaciones, escuelas y servicios legales que ayudan específicamente a los recién llegados. Todos los perfiles con el check naranja han sido verificados por nosotros."
                    />
                </div>
                <label className="flex flex-col h-12 w-full shadow-sm">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-card-dark overflow-hidden group border border-gray-200 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary transition-all">
                        <div className="text-gray-400 dark:text-gray-500 flex items-center justify-center pl-4 pr-2">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-[#111815] dark:text-white focus:outline-0 border-none h-full placeholder:text-gray-400 dark:placeholder:text-gray-600 px-2 text-base font-normal leading-normal"
                            placeholder="Buscar ayuda legal, médica, ONGs..."
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="pr-4 text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </div>
                </label>
            </div>

            <div className="sticky top-[65px] z-10 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
                <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveFilter('Todos')}
                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 shadow-sm transition-colors ${activeFilter === 'Todos' ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark text-[#111815] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <p className="text-sm font-semibold leading-normal">Todos</p>
                    </button>
                    <button
                        onClick={() => setActiveFilter('Legal')}
                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${activeFilter === 'Legal' ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-base">gavel</span>
                        <p className={`text-sm font-medium ${activeFilter === 'Legal' ? 'text-white' : 'text-[#111815] dark:text-white'}`}>Legal</p>
                    </button>
                    <button
                        onClick={() => setActiveFilter('Medical')}
                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${activeFilter === 'Medical' ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-base">medical_services</span>
                        <p className={`text-sm font-medium ${activeFilter === 'Medical' ? 'text-white' : 'text-[#111815] dark:text-white'}`}>Médico</p>
                    </button>
                    <button
                        onClick={() => setActiveFilter('Education')}
                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${activeFilter === 'Education' ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-base">school</span>
                        <p className={`text-sm font-medium ${activeFilter === 'Education' ? 'text-white' : 'text-[#111815] dark:text-white'}`}>Educación</p>
                    </button>
                    <button
                        onClick={() => setActiveFilter('Other')}
                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${activeFilter === 'Other' ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-base">diversity_3</span>
                        <p className={`text-sm font-medium ${activeFilter === 'Other' ? 'text-white' : 'text-[#111815] dark:text-white'}`}>Comunidad</p>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {isLoading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-4">refresh</span>
                        <p className="text-gray-500">Cargando directorio de {destinationName}...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item.id} className="flex flex-col gap-3 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in hover:border-primary/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 bg-contain bg-center bg-no-repeat rounded-lg size-[60px] bg-white relative overflow-hidden border border-gray-100 dark:border-gray-700" style={{ backgroundImage: `url("${item.image}")` }}></div>
                                <div className="flex flex-1 flex-col">
                                    <div className="flex items-center gap-1 mb-1">
                                        <h3 className="text-[#111815] dark:text-white text-base font-bold leading-tight">{item.name}</h3>
                                        {item.verified && (
                                            <span className="material-symbols-outlined text-primary text-[18px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{item.tag} • {item.location}</p>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm font-normal leading-snug line-clamp-3">{item.description}</p>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-1"></div>
                            <div className="flex items-center justify-between gap-2">
                                {item.phoneNumber ? (
                                    <a href={`tel:${item.phoneNumber.replace(/\s/g, '')}`} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-[#111815] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">call</span> Llamar
                                    </a>
                                ) : item.email ? (
                                    <a href={`mailto:${item.email}`} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-[#111815] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">mail</span> Email
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-gray-400 text-sm font-medium cursor-not-allowed">
                                        <span className="material-symbols-outlined text-[18px]">block</span> No Contacto
                                    </button>
                                )}

                                {item.website ? (
                                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-[#111815] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">public</span> Web
                                    </a>
                                ) : (
                                    <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-[#111815] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <span className="material-symbols-outlined text-[18px]">map</span> Mapa
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <div className="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl">travel_explore</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Directorios pronto en {destinationName}</h3>
                        <p className="max-w-xs text-sm">Nuestro equipo está verificando ONGs y servicios legales en {destinationName}. ¡Vuelve pronto!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
