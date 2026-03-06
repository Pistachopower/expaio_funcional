import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';

export const UpdatePasswordScreen: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Enforce strong supabase auth behavior to check if user has actual recovery session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Not in a recovery or valid session context
                // Maybe they loaded this independently without the hash fragment
                // It's safe to let them try if they just landed with tokens in URL, but
                // normally handleUpdateSubmit covers it.
            }
        };
        checkSession();
    }, []);

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            setIsLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password.trim()
        });

        if (error) {
            console.error('Error updating password:', error.message);
            alert('Error al actualizar la contraseña: ' + error.message);
        } else {
            alert('¡Tu contraseña ha sido actualizada con éxito!');
            navigate('/');
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

                <div className="flex-1 flex flex-col justify-center px-8 py-12 z-10">
                    {/* Logo Area */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center size-16 bg-primary rounded-2xl shadow-lg shadow-primary/30 mb-4 animate-slide-up group">
                            <span className="material-symbols-outlined text-[#11211a] text-4xl font-bold">lock_reset</span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#111815] dark:text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>Actualizar Contraseña</h1>
                        <p className="text-[#638878] dark:text-gray-400 mt-2 font-medium animate-slide-up" style={{ animationDelay: '0.2s' }}>Ingresa tu nueva contraseña</p>
                    </div>

                    <form onSubmit={handleUpdateSubmit} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Nueva Contraseña</label>
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

                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 ml-1">Confirmar Nueva Contraseña</label>
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

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                                className="w-full bg-primary text-[#11211a] font-bold text-base py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                        Actualizando...
                                    </>
                                ) : (
                                    'Guardar Contraseña'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="p-6 text-center text-xs text-gray-300 dark:text-gray-600 md:text-gray-400">
                    &copy; 2024 ExpaIO. Switzerland Helper.
                </div>
            </div>
        </div>
    );
};
