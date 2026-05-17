import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../../context/AuthContext';
import { AdminContentManager } from './AdminContentManager';

interface UserProfile {
    id: string;
    nombre: string;
    apellido: string;
    rol: string;
    estado_cuenta: string;
    telefono: string;
    fecha_nacimiento: string;
    como_nos_conocio: string;
    genero: string;
    pais_origen_id: string;
    pais_destino_id: string;
    fecha_actualizacion: string;
    pais_origen?: string;
    pais_destino?: string;
    email?: string;
    checklist_count?: number;
    gastos_count?: number;
}

interface PageEvent {
    id: string;
    usuario_id: string;
    pagina: string;
    duracion_seg: number;
    timestamp: string;
    perfiles?: { nombre: string; apellido: string };
}

type Tab = 'overview' | 'users' | 'pending' | 'analytics' | 'content';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState<Tab>('overview');
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [pendings, setPendings] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [editName, setEditName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [countries, setCountries] = useState<Record<string, string>>({});
    const [events, setEvents] = useState<PageEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    // Stats
    const [stats, setStats] = useState({ total: 0, emigrantes: 0, expertos: 0, pendientes: 0, paises: 0 });

    const fetchAll = async () => {
        setLoading(true);

        // Fetch countries map
        const { data: paisesData } = await supabase.from('paises').select('id, nombre');
        const cMap: Record<string, string> = {};
        paisesData?.forEach(p => { cMap[p.id] = p.nombre; });
        setCountries(cMap);

        // Fetch all profiles
        const { data: profiles } = await supabase
            .from('perfiles')
            .select('*')
            .order('fecha_actualizacion', { ascending: false });

        if (profiles) {
            const enriched = profiles.map(p => ({
                ...p,
                pais_origen: cMap[p.pais_origen_id] || '—',
                pais_destino: cMap[p.pais_destino_id] || '—',
            }));
            setUsers(enriched);
            setPendings(enriched.filter(u => u.estado_cuenta === 'pendiente'));

            const destSet = new Set(profiles.map(p => p.pais_destino_id).filter(Boolean));
            setStats({
                total: profiles.length,
                emigrantes: profiles.filter(p => p.rol === 'emigrante').length,
                expertos: profiles.filter(p => ['abogado', 'profesor', 'ayuda'].includes(p.rol)).length,
                pendientes: profiles.filter(p => p.estado_cuenta === 'pendiente').length,
                paises: destSet.size,
            });
        }
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    useEffect(() => {
        if (tab === 'analytics' && events.length === 0) {
            fetchEvents();
        }
    }, [tab]);

    const fetchEvents = async () => {
        setLoadingEvents(true);
        const { data } = await supabase
            .from('eventos_pagina')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);
        
        if (data) {
            const mappedEvents = data.map(ev => {
                const userProfile = users.find(u => u.id === ev.usuario_id);
                return {
                    ...ev,
                    perfiles: userProfile ? { nombre: userProfile.nombre, apellido: userProfile.apellido } : undefined
                };
            });
            setEvents(mappedEvents as any[]);
        }
        setLoadingEvents(false);
    };

    const approveUser = async (id: string, rol: string) => {
        await supabase.from('perfiles').update({ estado_cuenta: 'aprobado' }).eq('id', id);
        if (['profesor', 'abogado', 'ayuda'].includes(rol)) {
            await supabase.from('expertos').update({ aprobado: true }).eq('usuario_id', id);
        }
        fetchAll();
    };

    const rejectUser = async (id: string) => {
        if (!window.confirm('¿Rechazar a este usuario?')) return;
        await supabase.from('perfiles').update({ estado_cuenta: 'rechazado' }).eq('id', id);
        fetchAll();
    };

    const deleteUser = async (id: string) => {
        if (id === user?.id) {
            alert('No puedes eliminarte a ti mismo.');
            return;
        }
        if (!window.confirm('⚠️ ¿ELIMINAR este usuario permanentemente? Esta acción no se puede deshacer.')) return;
        await supabase.from('perfiles').delete().eq('id', id);
        setSelectedUser(null);
        fetchAll();
    };

    const updateUser = async () => {
        if (!selectedUser) return;
        await supabase.from('perfiles').update({ nombre: editName, apellido: editLastName } as any).eq('id', selectedUser.id);
        setSelectedUser(null);
        fetchAll();
    };

    const openEdit = (u: UserProfile) => {
        setSelectedUser(u);
        setEditName(u.nombre || '');
        setEditLastName(u.apellido || '');
    };

    const filtered = users.filter(u =>
        `${u.nombre} ${u.apellido} ${u.rol} ${u.pais_destino}`.toLowerCase().includes(search.toLowerCase())
    );

    const rolBadge = (rol: string) => {
        const colors: Record<string, string> = {
            admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            abogado: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            profesor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            emigrante: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            ayuda: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
        return colors[rol] || 'bg-gray-100 text-gray-700';
    };

    const estadoBadge = (e: string) => {
        if (e === 'aprobado') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        if (e === 'pendiente') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    // Count destinations
    const destCounts: Record<string, number> = {};
    users.forEach(u => { if (u.pais_destino && u.pais_destino !== '—') destCounts[u.pais_destino] = (destCounts[u.pais_destino] || 0) + 1; });
    const topDests = Object.entries(destCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const originCounts: Record<string, number> = {};
    users.forEach(u => { if (u.pais_origen && u.pais_origen !== '—') originCounts[u.pais_origen] = (originCounts[u.pais_origen] || 0) + 1; });
    const topOrigins = Object.entries(originCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return (
        <div className="flex flex-col h-full animate-fade-in w-full max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-24 text-[#111815] dark:text-white overflow-y-auto">
            {/* Header */}
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Panel de Administración</h1>
                </div>
                <p className="text-sm text-gray-500">Gestión completa de la plataforma ExpaIO</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                {([['overview', 'dashboard', 'Resumen'], ['users', 'group', 'Usuarios'], ['pending', 'hourglass_empty', 'Pendientes'], ['content', 'edit_document', 'Contenido'], ['analytics', 'monitoring', 'Analíticas']] as const).map(([key, icon, label]) => (
                    <button key={key} onClick={() => setTab(key as Tab)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${tab === key ? 'bg-primary text-[#11211a] shadow-md shadow-primary/20' : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                        {label}
                        {key === 'pending' && stats.pendientes > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{stats.pendientes}</span>
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center py-20">
                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                </div>
            ) : (
                <>
                    {/* OVERVIEW TAB */}
                    {tab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Total Usuarios', value: stats.total, icon: 'group', color: 'text-primary' },
                                    { label: 'Emigrantes', value: stats.emigrantes, icon: 'flight_takeoff', color: 'text-blue-500' },
                                    { label: 'Expertos', value: stats.expertos, icon: 'school', color: 'text-purple-500' },
                                    { label: 'Pendientes', value: stats.pendientes, icon: 'hourglass_empty', color: 'text-orange-500' },
                                ].map(s => (
                                    <div key={s.label} className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                                        <span className={`material-symbols-outlined ${s.color} text-2xl mb-2 block`}>{s.icon}</span>
                                        <p className="text-2xl font-extrabold">{s.value}</p>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Top Destinations */}
                                <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">flight_land</span>
                                        Destinos Populares
                                    </h3>
                                    {topDests.length === 0 ? <p className="text-sm text-gray-400">Sin datos</p> : (
                                        <div className="space-y-2">
                                            {topDests.map(([name, count]) => (
                                                <div key={name} className="flex items-center justify-between">
                                                    <span className="text-sm">{name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-primary rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 w-6 text-right">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Origins */}
                                <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-500 text-lg">flight_takeoff</span>
                                        Países de Origen
                                    </h3>
                                    {topOrigins.length === 0 ? <p className="text-sm text-gray-400">Sin datos</p> : (
                                        <div className="space-y-2">
                                            {topOrigins.map(([name, count]) => (
                                                <div key={name} className="flex items-center justify-between">
                                                    <span className="text-sm">{name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 w-6 text-right">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Roles breakdown */}
                            <div className="bg-white dark:bg-card-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-500 text-lg">pie_chart</span>
                                    Distribución por Rol
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(users.reduce((acc: Record<string, number>, u) => { acc[u.rol] = (acc[u.rol] || 0) + 1; return acc; }, {} as Record<string, number>))
                                        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
                                        .map(([rol, count]) => (
                                            <div key={rol} className={`px-4 py-2 rounded-xl text-sm font-bold ${rolBadge(rol)}`}>
                                                {rol.charAt(0).toUpperCase() + rol.slice(1)}: {count}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {tab === 'users' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-700 px-4 h-12">
                                <span className="material-symbols-outlined text-gray-400">search</span>
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, rol, país..."
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm" />
                                {search && <button onClick={() => setSearch('')}><span className="material-symbols-outlined text-gray-400 text-lg">close</span></button>}
                            </div>
                            <p className="text-xs text-gray-400">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</p>

                            <div className="space-y-3">
                                {filtered.map(u => (
                                    <div key={u.id} className="bg-white dark:bg-card-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg uppercase shrink-0">
                                                    {u.nombre?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm truncate">{u.nombre} {u.apellido}</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${rolBadge(u.rol)}`}>{u.rol}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${estadoBadge(u.estado_cuenta)}`}>{u.estado_cuenta}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-[11px] text-gray-500">
                                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-black/20 px-2 py-1.5 rounded-lg">
                                                <span className="material-symbols-outlined text-[14px]">flight_takeoff</span>
                                                {u.pais_origen || '—'}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-black/20 px-2 py-1.5 rounded-lg">
                                                <span className="material-symbols-outlined text-[14px]">flight_land</span>
                                                {u.pais_destino || '—'}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-black/20 px-2 py-1.5 rounded-lg">
                                                <span className="material-symbols-outlined text-[14px]">call</span>
                                                {u.telefono || '—'}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-black/20 px-2 py-1.5 rounded-lg">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                {u.fecha_actualizacion ? new Date(u.fecha_actualizacion).toLocaleDateString('es') : '—'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PENDING TAB */}
                    {tab === 'pending' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">hourglass_empty</span>
                                Pendientes ({pendings.length})
                            </h2>
                            {pendings.length === 0 ? (
                                <div className="text-center p-12 text-gray-500 bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <span className="material-symbols-outlined text-4xl mb-3 block text-gray-300">check_circle</span>
                                    No hay usuarios pendientes.
                                </div>
                            ) : (
                                pendings.map(u => (
                                    <div key={u.id} className="p-5 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold uppercase">{u.nombre?.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold">{u.nombre} {u.apellido}</p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${rolBadge(u.rol)}`}>{u.rol}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                                            <p className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 px-3 py-2 rounded-lg">
                                                <span className="material-symbols-outlined text-sm text-gray-400">call</span>{u.telefono || '—'}
                                            </p>
                                            <p className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 px-3 py-2 rounded-lg">
                                                <span className="material-symbols-outlined text-sm text-gray-400">cake</span>{u.fecha_nacimiento || '—'}
                                            </p>
                                            <p className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 px-3 py-2 rounded-lg">
                                                <span className="material-symbols-outlined text-sm text-gray-400">campaign</span>{u.como_nos_conocio?.replace('_', ' ') || '—'}
                                            </p>
                                            <p className="flex items-center gap-2 bg-gray-50 dark:bg-black/20 px-3 py-2 rounded-lg">
                                                <span className="material-symbols-outlined text-sm text-gray-400">flight_land</span>{u.pais_destino || '—'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => rejectUser(u.id)}
                                                className="flex-1 py-3 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-200 transition-colors">
                                                <span className="material-symbols-outlined text-lg">close</span>Rechazar
                                            </button>
                                            <button onClick={() => approveUser(u.id, u.rol)}
                                                className="flex-1 py-3 bg-primary text-[#11211a] rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                                <span className="material-symbols-outlined text-lg">check</span>Aprobar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {tab === 'analytics' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">monitoring</span>
                                Actividad de Usuarios
                            </h2>
                            {loadingEvents ? (
                                <div className="text-center p-12 text-gray-500">Cargando eventos...</div>
                            ) : events.length === 0 ? (
                                <div className="text-center p-12 text-gray-500 bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800">
                                    No hay eventos registrados aún.
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                                                <tr>
                                                    <th className="px-4 py-3">Usuario</th>
                                                    <th className="px-4 py-3">Página Visitada</th>
                                                    <th className="px-4 py-3">Duración</th>
                                                    <th className="px-4 py-3">Fecha/Hora</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                {events.map(ev => (
                                                    <tr key={ev.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                                        <td className="px-4 py-3 font-medium">
                                                            {ev.perfiles ? `${ev.perfiles.nombre} ${ev.perfiles.apellido}` : 'Usuario eliminado'}
                                                        </td>
                                                        <td className="px-4 py-3 text-primary font-bold">{ev.pagina}</td>
                                                        <td className="px-4 py-3">
                                                            {ev.duracion_seg < 60 ? `${ev.duracion_seg} seg` : `${Math.floor(ev.duracion_seg / 60)} min ${ev.duracion_seg % 60} seg`}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-500">
                                                            {new Date(ev.timestamp).toLocaleString('es')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CONTENT MANAGER TAB */}
                    {tab === 'content' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit_document</span>
                                Gestión de Contenido
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">Añade o edita la información de los diferentes países en las secciones principales.</p>
                            <AdminContentManager />
                        </div>
                    )}
                </>
            )}

            {/* Edit Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">edit</span>
                            Editar Usuario
                        </h3>
                        <div className="space-y-3 mb-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre</label>
                                <input value={editName} onChange={e => setEditName(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#11211a] border border-gray-200 dark:border-gray-700 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Apellido</label>
                                <input value={editLastName} onChange={e => setEditLastName(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-[#11211a] border border-gray-200 dark:border-gray-700 text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Rol</p>
                                    <p className="font-bold capitalize">{selectedUser.rol}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Estado</p>
                                    <p className="font-bold capitalize">{selectedUser.estado_cuenta}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Origen</p>
                                    <p className="font-bold">{selectedUser.pais_origen}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-black/20 p-3 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Destino</p>
                                    <p className="font-bold">{selectedUser.pais_destino}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setSelectedUser(null)}
                                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm">Cancelar</button>
                            <button onClick={updateUser}
                                className="flex-1 py-3 rounded-xl bg-primary text-[#11211a] font-bold text-sm shadow-md shadow-primary/20">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
