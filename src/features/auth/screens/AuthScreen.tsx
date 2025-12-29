import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';

export const AuthScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Auth Flow State: 'credentials' or 'onboarding'
    const [authStep, setAuthStep] = useState<'credentials' | 'onboarding'>('credentials');

    // Credentials Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    // Onboarding Form State
    const [age, setAge] = useState('');
    const [isSpanish, setIsSpanish] = useState('yes'); // 'yes' | 'no'
    const [occupation, setOccupation] = useState('');
    const [studies, setStudies] = useState('');
    const [purpose, setPurpose] = useState('work'); // 'work' | 'study' | 'family' | 'other'
    const [familyStatus, setFamilyStatus] = useState('single'); // 'single' | 'family'

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
                        full_name: cleanName,
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

    // --- Step 2: Handle Onboarding Submission ---
    const handleOnboardingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 18) {
            setIsLoading(false);
            alert("Lo sentimos. Debes ser mayor de 18 años para utilizar esta aplicación legal y laboralmente en Suiza.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const updates = {
                id: user.id,
                full_name: `${name} ${lastName}`.trim(),
                first_name: name,
                last_name: lastName,
                username: username,
                age: ageNum,
                is_spanish: isSpanish === 'yes',
                occupation,
                studies,
                origin: isSpanish === 'yes' ? 'España' : 'Otro',
                updated_at: new Date().toISOString(),
                canton: 'Zürich',
                permit: 'Permiso B',
                arrival_date: new Date().toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
                sector: occupation,
                purpose: purpose,
                family_status: familyStatus,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                console.error('Error updating profile:', error);
                alert('Error al guardar el perfil: ' + error.message);
            } else {
                navigate('/');
            }
        } else {
            alert('Sesión no encontrada. Por favor inicia sesión nuevamente.');
            setAuthStep('credentials');
        }

        setIsLoading(false);
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
                        <p className="text-[#638878] dark:text-gray-400 mt-2 font-medium animate-slide-up" style={{ animationDelay: '0.3s' }}>Tu compañero para vivir en Suiza</p>
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
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Contraseña</label>
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

                    {authStep === 'onboarding' && (
                        <form onSubmit={handleOnboardingSubmit} className="space-y-4 animate-slide-up">
                            <div className="text-center mb-4">
                                <h2 className="text-xl font-bold text-[#111815] dark:text-white">Configura tu Perfil</h2>
                                <p className="text-sm text-gray-500">Cuéntanos un poco más sobre ti para personalizar tu experiencia.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Edad</label>
                                    <input
                                        type="number"
                                        required
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Ej: 25"
                                        min="0"
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">¿Eres Español?</label>
                                    <select
                                        value={isSpanish}
                                        onChange={(e) => setIsSpanish(e.target.value)}
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all appearance-none"
                                    >
                                        <option value="yes">Sí, soy español</option>
                                        <option value="no">No, de otro país</option>
                                    </select>
                                </div>
                            </div>

                            {isSpanish === 'no' && (
                                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30 rounded-xl animate-fade-in">
                                    <div className="flex gap-2">
                                        <span className="material-symbols-outlined text-orange-500 text-[20px]">info</span>
                                        <p className="text-xs text-orange-700 dark:text-orange-300 leading-tight">
                                            ExpaIO está diseñada actualmente para españoles, pero próximamente estará disponible para otras nacionalidades. ¡Puedes seguir explorando!
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">¿Cuál es tu propósito en Suiza?</label>
                                <select
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all appearance-none"
                                >
                                    <option value="work">Trabajar</option>
                                    <option value="study">Estudiar</option>
                                    <option value="family">Reagrupación Familiar</option>
                                    <option value="other">Otros / Solo mirando</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Situación Personal</label>
                                <select
                                    value={familyStatus}
                                    onChange={(e) => setFamilyStatus(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all appearance-none"
                                >
                                    <option value="single">Soltero/a</option>
                                    <option value="family">Con familia / pareja</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Ocupación / Profesión</label>
                                <input
                                    type="text"
                                    required
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    placeholder="Ej: Ingeniero, Enfermero, Estudiante..."
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nivel de Estudios</label>
                                <input
                                    type="text"
                                    required
                                    value={studies}
                                    onChange={(e) => setStudies(e.target.value)}
                                    placeholder="Ej: Bachillerato, Grado, Máster..."
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a2e26] p-3.5 text-sm focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-all"
                                />
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
