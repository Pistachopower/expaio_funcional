import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type ContentType = 'directorio' | 'alertas' | 'audios_integracion';

interface Pais {
    id: string;
    nombre: string;
    codigo: string;
}

export const AdminContentManager: React.FC = () => {
    const [paises, setPaises] = useState<Pais[]>([]);
    const [selectedPais, setSelectedPais] = useState<string>('');
    const [contentType, setContentType] = useState<ContentType>('directorio');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchPaises();
    }, []);

    useEffect(() => {
        if (selectedPais) {
            fetchContent();
            setIsEditing(false);
        } else {
            setItems([]);
        }
    }, [selectedPais, contentType]);

    const fetchPaises = async () => {
        const { data } = await supabase.from('paises').select('*').order('nombre');
        if (data) setPaises(data);
    };

    const fetchContent = async () => {
        setLoading(true);
        const { data } = await supabase.from(contentType).select('*').eq('pais_id', selectedPais).order('fecha_creacion', { ascending: false });
        if (data) setItems(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;
        await supabase.from(contentType).delete().eq('id', id);
        fetchContent();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, pais_id: selectedPais };
        
        if (formData.id) {
            await supabase.from(contentType).update(payload).eq('id', formData.id);
        } else {
            await supabase.from(contentType).insert(payload);
        }
        
        setIsEditing(false);
        fetchContent();
    };

    const openNewForm = () => {
        setFormData({});
        setIsEditing(true);
    };

    const renderFormInputs = () => {
        const inputBase = "p-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#11211a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-400";
        
        if (contentType === 'directorio') {
            return (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Nombre" required className={inputBase} value={formData.nombre || ''} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                        <select className={inputBase} value={formData.tipo || 'other'} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                            <option value="medical">Médico</option>
                            <option value="legal">Legal</option>
                            <option value="education">Educación</option>
                            <option value="other">Otro</option>
                        </select>
                        <input placeholder="Ubicación" required className={inputBase} value={formData.ubicacion || ''} onChange={e => setFormData({...formData, ubicacion: e.target.value})} />
                        <input placeholder="Etiqueta (Ej: Asilo)" required className={inputBase} value={formData.tag || ''} onChange={e => setFormData({...formData, tag: e.target.value})} />
                    </div>
                    <textarea placeholder="Descripción" required className={`${inputBase} w-full mt-4 h-24 resize-none`} value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <input placeholder="Teléfono (Opcional)" className={inputBase} value={formData.telefono || ''} onChange={e => setFormData({...formData, telefono: e.target.value})} />
                        <input placeholder="Email (Opcional)" className={inputBase} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input placeholder="Sitio Web (Opcional)" className={`${inputBase} col-span-2`} value={formData.sitio_web || ''} onChange={e => setFormData({...formData, sitio_web: e.target.value})} />
                        <input placeholder="URL Imagen (Opcional)" className={`${inputBase} col-span-2`} value={formData.imagen_url || ''} onChange={e => setFormData({...formData, imagen_url: e.target.value})} />
                    </div>
                    <label className="flex items-center gap-2 mt-4 font-bold text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={formData.verificado || false} onChange={e => setFormData({...formData, verificado: e.target.checked})} />
                        Marca como Verificado
                    </label>
                </>
            );
        }
        
        if (contentType === 'alertas') {
            return (
                <div className="flex flex-col gap-4">
                    <input placeholder="Título de la Alerta" required className={`${inputBase} w-full`} value={formData.titulo || ''} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                    <select className={`${inputBase} w-full`} value={formData.prioridad || 'MEDIUM'} onChange={e => setFormData({...formData, prioridad: e.target.value})}>
                        <option value="LOW">Baja (Info)</option>
                        <option value="MEDIUM">Media</option>
                        <option value="HIGH">Alta</option>
                        <option value="CRITICAL">Crítica (Estafa activa)</option>
                    </select>
                    <textarea placeholder="Descripción breve" required className={`${inputBase} w-full h-16 resize-none`} value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                    <textarea placeholder="Detalles o instrucciones (Puedes usar guiones para viñetas)" className={`${inputBase} w-full h-24 resize-none`} value={formData.detalles || ''} onChange={e => setFormData({...formData, detalles: e.target.value})} />
                    <input placeholder="Fuente Oficial (Ej: Policía Local)" className={`${inputBase} w-full`} value={formData.fuente || ''} onChange={e => setFormData({...formData, fuente: e.target.value})} />
                    <input placeholder="Link para más info (Opcional)" className={`${inputBase} w-full`} value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} />
                </div>
            );
        }

        if (contentType === 'audios_integracion') {
            return (
                <div className="flex flex-col gap-4">
                    <input placeholder="Título del Audio" required className={`${inputBase} w-full`} value={formData.titulo || ''} onChange={e => setFormData({...formData, titulo: e.target.value})} />
                    <input placeholder="Nombre de archivo (ej: audio1.mp3)" required className={`${inputBase} w-full`} value={formData.filename || ''} onChange={e => setFormData({...formData, filename: e.target.value})} />
                    <textarea placeholder="Descripción" className={`${inputBase} w-full h-24 resize-none`} value={formData.descripcion || ''} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Duración (Ej: 3:45)" className={inputBase} value={formData.duracion || ''} onChange={e => setFormData({...formData, duracion: e.target.value})} />
                        <input placeholder="URL Imagen Portada" className={inputBase} value={formData.imagen_url || ''} onChange={e => setFormData({...formData, imagen_url: e.target.value})} />
                    </div>
                    <label className="flex items-center gap-2 font-bold text-sm text-gray-700 dark:text-gray-300">
                        <input type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={formData.featured || false} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                        Destacar (Featured)
                    </label>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-card-dark p-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">País a gestionar</label>
                    <select 
                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#11211a] font-bold"
                        value={selectedPais}
                        onChange={(e) => setSelectedPais(e.target.value)}
                    >
                        <option value="" disabled>Seleccione un país...</option>
                        {paises.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 w-full">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Sección</label>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        {[
                            { id: 'directorio', label: 'Directorio' },
                            { id: 'alertas', label: 'Seguridad' },
                            { id: 'audios_integracion', label: 'Integración' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setContentType(t.id as ContentType)}
                                className={`flex-1 text-sm font-bold py-1.5 rounded-md transition-all ${contentType === t.id ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {selectedPais ? (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">
                                {contentType === 'directorio' ? 'contact_phone' : contentType === 'alertas' ? 'warning' : 'headphones'}
                            </span>
                            Elementos ({items.length})
                        </h2>
                        <button onClick={openNewForm} className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:brightness-105 active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-lg">add</span> Agregar
                        </button>
                    </div>

                    {isEditing && (
                        <form onSubmit={handleSave} className="bg-gray-50 dark:bg-[#1a2e26] p-5 rounded-2xl border border-gray-200 dark:border-primary/30 animate-fade-in shadow-inner">
                            <h3 className="font-bold mb-4">{formData.id ? 'Editar' : 'Nuevo'} Elemento</h3>
                            {renderFormInputs()}
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">Cancelar</button>
                                <button type="submit" className="px-6 py-2 rounded-xl font-bold bg-primary text-white">Guardar Contenido</button>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="text-center py-10"><span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="bg-white dark:bg-card-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-2 relative group hover:border-primary/50 transition-all">
                                    <h3 className="font-bold text-[#111815] dark:text-white pr-8">{item.nombre || item.titulo}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-3">{item.descripcion}</p>
                                    <div className="mt-auto pt-2 flex gap-2">
                                        <button onClick={() => { setFormData(item); setIsEditing(true); }} className="text-xs font-bold text-blue-500 hover:underline">Editar</button>
                                        <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-red-500 hover:underline">Eliminar</button>
                                    </div>
                                    <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${item.verificado ? 'bg-green-500' : contentType === 'alertas' ? 'bg-orange-500' : 'bg-gray-300'}`}></span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 text-gray-400 bg-white dark:bg-card-dark rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="material-symbols-outlined text-4xl mb-2">public</span>
                    <p className="font-bold">Selecciona un país para gestionar su contenido.</p>
                </div>
            )}
        </div>
    );
};
