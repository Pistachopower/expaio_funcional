import React, { useState } from 'react';
import { BackHeader, InfoButton } from '../../../components';

interface DirectoryItem {
    id: string;
    name: string;
    type: 'Medical' | 'Legal' | 'Education' | 'Other';
    tag: string;
    location: string;
    description: string;
    image: string;
    verified: boolean;
}

const DIRECTORY_ITEMS: DirectoryItem[] = [
    {
        id: '1',
        name: 'Cruz Roja Suiza',
        type: 'Medical',
        tag: 'Humanitario',
        location: '2.5 km',
        description: 'Ayuda humanitaria de emergencia y soporte médico integral.',
        image: 'https://picsum.photos/seed/redcross/200',
        verified: true
    },
    {
        id: '2',
        name: 'Zürich Deutschkurse',
        type: 'Education',
        tag: 'Alemán',
        location: '1.2 km',
        description: 'Escuela oficial de alemán. Cursos intensivos A1-C1 y dialecto suizo para recién llegados.',
        image: 'https://picsum.photos/seed/germanclass/200',
        verified: true
    },
    {
        id: '3',
        name: 'Sarah Smith Education',
        type: 'Education',
        tag: 'Inglés',
        location: 'Online / Zürich',
        description: 'Clases particulares de inglés de negocios y preparación para exámenes. Profesora nativa.',
        image: 'https://picsum.photos/seed/englishteacher/200',
        verified: true
    },
    {
        id: '4',
        name: 'LegalHelp Zürich',
        type: 'Legal',
        tag: 'Legal',
        location: 'Zürich HB',
        description: 'Asesoría jurídica gratuita para inmigrantes sobre permisos de residencia y trabajo.',
        image: 'https://picsum.photos/seed/lawyer/200',
        verified: true
    },
    {
        id: '5',
        name: 'Hans Müller - Tutor',
        type: 'Education',
        tag: 'Alemán',
        location: 'Bern',
        description: 'Profesor certificado de alemán. Especializado en integración cultural y lingüística.',
        image: 'https://picsum.photos/seed/tutorhans/200',
        verified: true
    }
];

export const DirectoryScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'Todos' | 'Legal' | 'Medical' | 'Education'>('Todos');

    const filteredItems = DIRECTORY_ITEMS.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tag.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = activeFilter === 'Todos' || item.type === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-y-auto animate-fade-in w-full max-w-5xl mx-auto">
            <BackHeader title="Directorio Verificado" />
            <div className="bg-surface-light dark:bg-surface-dark px-4 pb-4 pt-2">
                <div className="flex items-center mb-4">
                    <h1 className="text-[#111815] dark:text-white tracking-tight text-[26px] font-bold leading-tight text-left">Directorio</h1>
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
                            placeholder="Buscar profesores, ayuda legal..."
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
                        onClick={() => setActiveFilter('Education')}
                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors ${activeFilter === 'Education' ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-base">school</span>
                        <p className={`text-sm font-medium ${activeFilter === 'Education' ? 'text-white' : 'text-[#111815] dark:text-white'}`}>Educación</p>
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
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item.id} className="flex flex-col gap-3 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in hover:border-primary/30 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 bg-center bg-no-repeat bg-cover rounded-lg size-[60px] bg-gray-100 dark:bg-gray-800 relative overflow-hidden" style={{ backgroundImage: `url("${item.image}")` }}></div>
                                <div className="flex flex-1 flex-col">
                                    <div className="flex items-center gap-1 mb-1">
                                        <h3 className="text-[#111815] dark:text-white text-base font-bold leading-tight">{item.name}</h3>
                                        {item.verified && (
                                            <span className="material-symbols-outlined text-primary text-[18px] filled" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wide mb-1">{item.tag} • {item.location}</p>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm font-normal leading-snug line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full my-1"></div>
                            <div className="flex items-center justify-between gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-[#111815] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <span className="material-symbols-outlined text-[18px]">call</span> Contactar
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-gray-50 dark:bg-card-dark text-[#111815] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <span className="material-symbols-outlined text-[18px]">map</span> Mapa
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-10 text-center opacity-60">
                        <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                        <p>No se encontraron resultados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
