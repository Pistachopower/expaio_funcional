import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';

const WORLD_COUNTRIES = [
    "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda",
     "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Esuatini", "Etiopía", "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guinea", "Guinea Ecuatorial", "Guinea-Bisáu", "Guyana", "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo", "Macedonia del Norte", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", "Países Bajos", "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana", "República Checa", "República del Congo", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumanía", "Rusia", "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam", "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Yibuti", "Zambia", "Zimbabue"
];

const SearchableCountrySelect = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = WORLD_COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

    return (
        <div ref={wrapperRef} className="relative w-full mb-4">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">{label}</label>
            <div 
                className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm cursor-pointer border flex justify-between items-center text-[#111815] dark:text-gray-100 shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value || placeholder}</span>
                <span className="material-symbols-outlined text-gray-400 text-lg">{isOpen ? 'expand_less' : 'expand_more'}</span>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#20362c] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down">
                    <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 dark:bg-[#1a2e26] p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" 
                            placeholder="Escribe para buscar..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto no-scrollbar">
                        {filtered.length > 0 ? (
                            filtered.map(country => (
                                <div 
                                    key={country}
                                    className={`p-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors ${value === country ? 'bg-primary/10 text-primary font-bold' : 'text-gray-700 dark:text-gray-200'}`}
                                    onClick={() => {
                                        onChange(country);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    {country}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-center text-red-500 font-medium">
                                El país no existe o está mal escrito.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const AuthScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Auth Flow State: 'credentials', 'onboarding', or 'forgotPassword'
    const [authStep, setAuthStep] = useState<'credentials' | 'onboarding' | 'forgotPassword'>('credentials');

    // Credentials Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [rol, setRol] = useState('emigrante');

    const [countries, setCountries] = useState<any[]>([]);
    const [paisOrigenId, setPaisOrigenId] = useState('');
    const [paisDestinoId, setPaisDestinoId] = useState('');

    // Onboarding Form State
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [genero, setGenero] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comoNosConocio, setComoNosConocio] = useState('');
    const [aceptaMarketing, setAceptaMarketing] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            const { data } = await supabase.from('paises').select('id, nombre').order('nombre');
            if (data) setCountries(data);
        };
        fetchCountries();
    }, []);

    // --- Step 1: Handle Credentials Submission ---
    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            // Login Logic
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim(),
            });

            if (error) {
                console.error('Error logging in:', error.message);
                alert('Error al iniciar sesión: ' + error.message);
                setIsLoading(false);
            } else {
                navigate('/');
            }
        } else {
            // Sign Up Logic
            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
                setPassword('');
                setConfirmPassword('');
                setIsLoading(false);
                return;
            }

            const cleanEmail = email.trim();
            const cleanPassword = password.trim();
            const cleanName = name.trim();
            const cleanLastName = lastName.trim();

            console.log('--- DEBUG START ---');
            console.log('Attempting signup with email:', cleanEmail);
            console.log('Email length:', cleanEmail.length);
            console.log('Character codes:', cleanEmail.split('').map(c => c.charCodeAt(0)));
            console.log('--- DEBUG END ---');

            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password: cleanPassword,
                options: {
                    data: {
                        nombre: cleanName,
                        apellido: cleanLastName,
                        rol: rol,
                        pais_destino_id: paisDestinoId
                    },
                },
            });

            if (error) {
                console.error('Error signing up:', error.message);
                alert('Error al registrarse: ' + error.message);
                setIsLoading(false);
            } else if (data.session) {
                setAuthStep('onboarding');
                setIsLoading(false);
            } else {
                alert("Registro exitoso. Por favor, verifica tu correo electrónico.");
                setIsLoading(false);
            }
        }
    };

    // --- Step 1.5: Handle Forgot Password Submission ---
    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
            console.error('Error sending password reset email:', error.message);
            alert('Error al enviar el correo de recuperación: ' + error.message);
        } else {
            alert('Se ha enviado un correo con las instrucciones para recuperar tu contraseña.');
            setAuthStep('credentials');
        }
        setIsLoading(false);
    };

    const handleOnboardingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!fechaNacimiento) {
            setIsLoading(false);
            alert("Por favor, ingresa tu fecha de nacimiento.");
            return;
        }

        let finalOrigenId = null;
        let finalDestinoId = null;

        try {
            // Resolver UUID del pais de origen
            if (paisOrigenId) {
                const { data: existC } = await supabase.from('paises').select('id').eq('nombre', paisOrigenId).single();
                if (existC) {
                    finalOrigenId = existC.id;
                } else {
                    const { data: newC, error } = await supabase.from('paises').insert({ nombre: paisOrigenId }).select('id').single();
                    if (error && error.code !== '23505') throw error;
                    if (newC) finalOrigenId = newC.id;
                    else {
                        const { data: retry } = await supabase.from('paises').select('id').eq('nombre', paisOrigenId).single();
                        if (retry) finalOrigenId = retry.id;
                    }
                }
            }

            // Resolver UUID del pais de destino
            if (paisDestinoId) {
                const { data: existC } = await supabase.from('paises').select('id').eq('nombre', paisDestinoId).single();
                if (existC) {
                    finalDestinoId = existC.id;
                } else {
                    const { data: newC, error } = await supabase.from('paises').insert({ nombre: paisDestinoId }).select('id').single();
                    if (error && error.code !== '23505') throw error;
                    if (newC) finalDestinoId = newC.id;
                    else {
                        const { data: retry } = await supabase.from('paises').select('id').eq('nombre', paisDestinoId).single();
                        if (retry) finalDestinoId = retry.id;
                    }
                }
            }

            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const updates = {
                    fecha_nacimiento: fechaNacimiento || null,
                    genero: genero,
                    telefono: telefono,
                    como_nos_conocio: comoNosConocio,
                    acepta_marketing: aceptaMarketing,
                    fecha_actualizacion: new Date().toISOString(),
                    nombre: name,
                    apellido: lastName,
                    pais_origen_id: finalOrigenId,
                    pais_destino_id: finalDestinoId
                };

                const { error: profileError } = await supabase.from('perfiles').update(updates).eq('id', user.id);

                if (profileError) throw profileError;
                navigate('/');
            } else {
                alert('Sesión no encontrada. Por favor inicia sesión nuevamente.');
                setAuthStep('credentials');
            }
        } catch (error: any) {
            console.error('Error in onboarding submission:', error);
            alert('Oh no! Ha ocurrido un error guardando el perfil: ' + (error.message || 'Código desconocido'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0d1411] p-0 md:p-4 selection:bg-primary/30 relative overflow-hidden md:overflow-visible">
            {/* Desktop Background Elements */}
            <div className="hidden md:block absolute top-[-10%] left-[-10%] size-[500px] bg-primary/20 rounded-full blur-[128px] pointer-events-none opacity-50 dark:opacity-20"></div>
            <div className="hidden md:block absolute bottom-[-10%] right-[-10%] size-[500px] bg-orange-500/10 rounded-full blur-[128px] pointer-events-none opacity-50 dark:opacity-20"></div>

            <div className="flex flex-col h-full md:h-auto w-full max-w-md mx-auto bg-background-light dark:bg-background-dark md:bg-white md:dark:bg-[#111c18] md:rounded-3xl md:shadow-2xl md:overflow-hidden animate-fade-in relative transition-all z-10 border-none md:border md:border-white/50 md:dark:border-white/5">
                {/* Background Decor (Mobile/Inner) */}
                <div className="absolute -top-20 -right-20 size-64 bg-primary/20 rounded-full blur-3xl pointer-events-none md:bg-primary/10"></div>
                <div className="absolute top-40 -left-20 size-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex-1 flex flex-col justify-center px-8 z-10">
                    {/* Logo Area */}
                    <div className="mb-8 text-center">
                        <button
                            onClick={() => navigate('/about')}
                            className="inline-flex items-center justify-center size-16 bg-primary rounded-2xl shadow-lg shadow-primary/30 mb-4 animate-slide-up hover:scale-105 transition-transform group"
                            style={{ animationDelay: '0.1s' }}
                            title="Saber más sobre nosotros"
                        >
                            <span className="material-symbols-outlined text-[#11211a] text-4xl font-bold group-hover:rotate-12 transition-transform">all_inclusive</span>
                        </button>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#111815] dark:text-white animate-slide-up" style={{ animationDelay: '0.2s' }}>ExpaIO</h1>
                        <p className="text-[#638878] dark:text-gray-400 mt-2 font-medium animate-slide-up" style={{ animationDelay: '0.3s' }}>Tu compañero para vivir en donde sueñas</p>
                    </div>

                    {authStep === 'credentials' && (
                        <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>

                            {!isLogin && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nombre</label>
                                            <input
                                                type="text"
                                                required={!isLogin}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Nombre"
                                                className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Apellidos</label>
                                            <input
                                                type="text"
                                                required={!isLogin}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Apellidos"
                                                className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nombre de Usuario</label>
                                        <input
                                            type="text"
                                            required={!isLogin}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="ej: nelson99"
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">¿Cómo vas a usar ExpaIO?</label>
                                        <select
                                            value={rol}
                                            onChange={(e) => setRol(e.target.value)}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                        >
                                            <option value="emigrante">Voy a Emigrar / Soy Migrante</option>
                                            <option value="profesor">Ofrezco mis servicios (Profesor)</option>
                                            <option value="abogado">Ofrezco mis servicios (Abogado)</option>
                                            <option value="ayuda">Ofrezco mis servicios (Centro de Ayuda)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hola@ejemplo.com"
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5 px-1">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contraseña</label>
                                    {isLogin && (
                                        <button
                                            type="button"
                                            onClick={() => setAuthStep('forgotPassword')}
                                            className="text-xs font-bold text-primary hover:underline focus:outline-none"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 pr-11 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full rounded-xl border bg-white dark:bg-[#1a2e26] p-3.5 pr-11 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-800'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
                                        >
                                            <span className="material-symbols-outlined text-xl">
                                                {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                    </div>
                                    {password && confirmPassword && password !== confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1 ml-1 font-medium">Las contraseñas no coinciden</p>
                                    )}
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-primary text-[#11211a] font-bold text-base py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                            Iniciando...
                                        </>
                                    ) : (
                                        <>{isLogin ? 'Iniciar Sesión' : 'Siguiente Paso'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {authStep === 'forgotPassword' && (
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 animate-slide-up">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold text-[#111815] dark:text-white">Recuperar Contraseña</h2>
                                <p className="text-sm text-gray-500 mt-2">Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hola@ejemplo.com"
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAuthStep('credentials')}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-base py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="flex-[2] bg-primary text-[#11211a] font-bold text-base py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    {isLoading ? (
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                    ) : (
                                        'Enviar Enlace'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {authStep === 'onboarding' && (
                        <form onSubmit={handleOnboardingSubmit} className="space-y-4 animate-slide-up">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold text-[#111815] dark:text-white">Configura tu Perfil</h2>
                                <p className="text-sm text-gray-500">Cuéntanos un poco más sobre ti para personalizar tu experiencia.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        required
                                        value={fechaNacimiento}
                                        onChange={(e) => setFechaNacimiento(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        placeholder="+34 600 000 000"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <SearchableCountrySelect
                                        label="¿De qué país vienes? (Origen)"
                                        placeholder="Selecciona tu país de origen..."
                                        value={paisOrigenId}
                                        onChange={setPaisOrigenId}
                                    />
                                </div>

                                <div>
                                    <SearchableCountrySelect
                                        label="¿A qué país quieres emigrar? (Destino)"
                                        placeholder="Selecciona el país de destino..."
                                        value={paisDestinoId}
                                        onChange={setPaisDestinoId}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">¿Cómo nos conociste?</label>
                                    <select
                                        value={comoNosConocio}
                                        onChange={(e) => setComoNosConocio(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                    >
                                        <option value="">Selección opcional...</option>
                                        <option value="redes_sociales">Redes Sociales (TikTok, Instragram...)</option>
                                        <option value="busqueda">Búsqueda en Google</option>
                                        <option value="amigo">Recomendación de un amigo o contacto</option>
                                        <option value="foro">Foro o Grupo (Facebook, Telegram...)</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>

                                <div className="flex items-start gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center h-5 mt-0.5">
                                        <input
                                            id="marketing"
                                            type="checkbox"
                                            checked={aceptaMarketing}
                                            onChange={(e) => setAceptaMarketing(e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="marketing" className="text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                                            Recibir comunicaciones y ofertas
                                        </label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                            Acepto recibir correos con consejos, mejoras de la app y ofertas relacionadas a mi plan de migración expaIO.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAuthStep('credentials')}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-base py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    Atrás
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] bg-primary text-[#11211a] font-bold text-base py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                            Guardando...
                                        </>
                                    ) : (
                                        'Crear Cuenta'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {authStep === 'credentials' && (
                        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setEmail('');
                                        setPassword('');
                                        setConfirmPassword('');
                                        setName('');
                                        setLastName('');
                                        setUsername('');
                                        setShowPassword(false);
                                        setShowConfirmPassword(false);
                                    }}
                                    className="ml-2 font-bold text-primary hover:underline"
                                >
                                    {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 text-center text-xs text-gray-300 dark:text-gray-600 md:text-gray-400">
                    &copy; 2024 ExpaIO. Switzerland Helper.
                </div>
            </div>
        </div>
    );
};
