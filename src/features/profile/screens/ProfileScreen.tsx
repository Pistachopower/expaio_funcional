import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackHeader } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { ProfileRepository, UserProfile } from '../../../api/repositories/ProfileRepository';

export const ProfileScreen: React.FC = () => {
    const { user, signOut } = useAuth();
    const [activeView, setActiveView] = useState<'main' | 'personal' | 'notifications' | 'privacy'>('main');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [userData, setUserData] = useState<any>(() => {
        const saved = localStorage.getItem('swisslife_profile');
        return saved ? JSON.parse(saved) : {
            name: 'Cargando...',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            phone: '',
            canton: 'Zürich',
            permit: 'Permiso B',
            arrival: '',
            sector: '',
            studies: '',
            photo: 'https://ui-avatars.com/api/?name=?&background=638878&color=fff'
        };
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            const data = await ProfileRepository.getProfile(user.id);

            if (data) {
                const profileData = {
                    name: data.full_name || 'Usuario',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    username: data.username || '',
                    email: user.email || '',
                    phone: data.phone || '',
                    canton: data.canton || 'Zürich',
                    permit: data.permit || 'Permiso B',
                    arrival: data.arrival_date || '',
                    sector: data.sector || '',
                    studies: data.studies || '',
                    photo: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name || 'U')}&background=638878&color=fff`
                };
                setUserData(profileData);
                localStorage.setItem('swisslife_profile', JSON.stringify(profileData));
            }
        };

        fetchProfile();
    }, [user]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            await ProfileRepository.updateProfile(user.id, {
                full_name: `${userData.firstName} ${userData.lastName}`.trim(),
                first_name: userData.firstName,
                last_name: userData.lastName,
                username: userData.username,
                canton: userData.canton,
                permit: userData.permit,
                arrival_date: userData.arrival,
                sector: userData.sector,
                studies: userData.studies,
                avatar_url: userData.photo,
                phone: userData.phone
            });

            localStorage.setItem('swisslife_profile', JSON.stringify(userData));
            setActiveView('main');
        } catch (error: any) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        localStorage.removeItem('swisslife_session');
        navigate('/login');
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setUserData({ ...userData, photo: ev.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    if (activeView === 'personal') {
        return (
            <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in w-full max-w-2xl mx-auto">
                <BackHeader title="Datos Personales" onBackOverride={() => setActiveView('main')} />
                <form onSubmit={handleSaveProfile} className="p-4 space-y-5 overflow-y-auto">
                    <div className="flex justify-center mb-4">
                        <div className="relative group">
                            <img
                                src={userData.photo}
                                alt="Profile"
                                className="size-28 rounded-full object-cover border-4 border-white dark:border-[#2a3942] shadow-lg"
                            />
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-2 border-white dark:border-[#2a3942] shadow-sm cursor-pointer hover:bg-primary-dark transition-colors">
                                <span className="material-symbols-outlined text-[20px] block">photo_camera</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nombre</label>
                                <input
                                    type="text"
                                    value={userData.firstName}
                                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Apellidos</label>
                                <input
                                    type="text"
                                    value={userData.lastName}
                                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nombre de Usuario</label>
                            <input
                                type="text"
                                value={userData.username}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Teléfono</label>
                            <input
                                type="tel"
                                value={userData.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Fecha Llegada</label>
                                <input
                                    type="text"
                                    value={userData.arrival}
                                    onChange={(e) => setUserData({ ...userData, arrival: e.target.value })}
                                    placeholder="Oct '23"
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Sector Laboral</label>
                                <input
                                    type="text"
                                    value={userData.sector}
                                    onChange={(e) => setUserData({ ...userData, sector: e.target.value })}
                                    placeholder="IT, Salud..."
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nivel de Estudios</label>
                            <input
                                type="text"
                                value={userData.studies}
                                onChange={(e) => setUserData({ ...userData, studies: e.target.value })}
                                placeholder="Bachillerato, Grado..."
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Cantón</label>
                                <select
                                    value={userData.canton}
                                    onChange={(e) => setUserData({ ...userData, canton: e.target.value })}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                                >
                                    <option>Zürich</option>
                                    <option>Bern</option>
                                    <option>Geneva</option>
                                    <option>Basel</option>
                                    <option>Vaud</option>
                                    <option>Lucerne</option>
                                    <option>Ticino</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Permiso</label>
                                <select
                                    value={userData.permit}
                                    onChange={(e) => setUserData({ ...userData, permit: e.target.value })}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e26] p-3 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm"
                                >
                                    <option>Permiso L</option>
                                    <option>Permiso B</option>
                                    <option>Permiso C</option>
                                    <option>Permiso G</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-[#11211a] font-bold py-4 rounded-xl text-sm shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all mt-6 disabled:opacity-50"
                    >
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        );
    }

    if (activeView === 'notifications') {
        return (
            <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in w-full max-w-2xl mx-auto">
                <BackHeader title="Notificaciones" onBackOverride={() => setActiveView('main')} />
                <div className="p-4 space-y-3 overflow-y-auto">
                    {[
                        { title: 'Alerta de Seguridad', desc: 'Nueva estafa de "Pisos Fantasma" detectada en Zúrich.', time: '2h', icon: 'shield', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
                        { title: 'Checklist Actualizada', desc: 'Has completado el 33% de tus tareas iniciales.', time: '1d', icon: 'check_circle', color: 'text-primary dark:text-primary bg-primary/20' },
                        { title: 'Bienvenido', desc: 'Gracias por usar SwissLife Helper. ¡Empieza a explorar!', time: '3d', icon: 'waving_hand', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                    ].map((notif, idx) => (
                        <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-[#1a2e26] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                                <span className="material-symbols-outlined text-[20px]">{notif.icon}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm text-[#111815] dark:text-white mb-0.5">{notif.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-medium">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{notif.desc}</p>
                            </div>
                        </div>
                    ))}
                    <div className="text-center pt-4">
                        <button className="text-xs font-bold text-gray-400 uppercase tracking-wide hover:text-primary transition-colors">Marcar todo como leído</button>
                    </div>
                </div>
            </div>
        );
    }

    if (activeView === 'privacy') {
        return (
            <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in w-full max-w-2xl mx-auto">
                <BackHeader title="Privacidad y Datos" onBackOverride={() => setActiveView('main')} />
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="flex flex-col items-center text-center mb-2">
                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                            <span className="material-symbols-outlined text-3xl">lock</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#111815] dark:text-white">Tus datos te pertenecen</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Transparencia total en el manejo de tu información.</p>
                    </div>

                    <div className="bg-white dark:bg-[#1a2e26] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-gray-400 mt-0.5">storage</span>
                            <div>
                                <h3 className="font-bold text-sm text-[#111815] dark:text-white">Almacenamiento Local</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    Tus tareas del checklist y configuración de perfil se guardan únicamente en tu dispositivo (LocalStorage). No tenemos servidores centrales que almacenen tu identidad.
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-800"></div>
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-gray-400 mt-0.5">smart_toy</span>
                            <div>
                                <h3 className="font-bold text-sm text-[#111815] dark:text-white">Inteligencia Artificial</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    Al usar el chat o el buscador de seguridad, las consultas se envían a Google Gemini de forma anónima para generar respuestas. No enviamos datos personales identificables.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1a2e26] p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-sm text-[#111815] dark:text-white mb-3">Acciones de Datos</h3>
                        <button
                            onClick={() => {
                                localStorage.removeItem('swisslife_checklist_v2');
                                localStorage.removeItem('swisslife_profile');
                                alert('Datos locales eliminados correctamente.');
                                window.location.reload();
                            }}
                            className="w-full py-3 border border-red-200 dark:border-red-900/50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                            Borrar todos mis datos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in w-full max-w-5xl mx-auto">
            <BackHeader title="Mi Perfil" />

            <div className="px-6 pt-6 pb-6 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => setActiveView('personal')}>
                        <img
                            src={userData.photo}
                            alt="Profile"
                            className="size-20 rounded-full object-cover border-4 border-white dark:border-[#2a3942] shadow-md"
                        />
                        <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full border-2 border-white dark:border-[#2a3942] transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-[14px] font-bold block">edit</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#111815] dark:text-white leading-tight">{userData.firstName} {userData.lastName}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{userData.username} • {userData.email}</p>
                        <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-wide">
                            {userData.permit}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-blue-500 mb-1">location_on</span>
                            <span className="text-xs text-gray-400 font-medium uppercase">Cantón</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{userData.canton}</span>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-purple-500 mb-1">calendar_month</span>
                            <span className="text-xs text-gray-400 font-medium uppercase">Llegada</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{userData.arrival}</span>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-orange-500 mb-1">work</span>
                            <span className="text-xs text-gray-400 font-medium uppercase">Sector</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">{userData.sector || '-'}</span>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-green-500 mb-1">school</span>
                            <span className="text-xs text-gray-400 font-medium uppercase">Estudios</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white truncate w-full">{userData.studies || '-'}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Nivel de Integración</h3>
                            <span className="text-xs font-bold text-primary">Intermedio</span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-primary-dark w-[65%]"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">¡Vas muy bien! Has completado la mayoría de los trámites iniciales.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2">Configuración</h3>

                    <button onClick={() => setActiveView('personal')} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group mb-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Datos Personales</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                    </button>

                    <button onClick={() => setActiveView('notifications')} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group mb-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Notificaciones</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex size-2 rounded-full bg-red-500"></span>
                            <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                        </div>
                    </button>

                    <button onClick={() => navigate('/about')} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group mb-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">info</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Sobre Nosotros y FAQ</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                    </button>

                    <button onClick={() => setActiveView('privacy')} className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors group mb-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Privacidad y Datos</span>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">chevron_right</span>
                    </button>

                    <button onClick={handleLogout} className="w-full py-4 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors mt-2">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
