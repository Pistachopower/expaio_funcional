
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { ProfileRepository, UserProfile } from '../api/repositories/ProfileRepository';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            // Timeout de seguridad: si en 4 segundos no hay respuesta, liberamos el spinner
            const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 4000));

            try {
                // Ejecutamos la recuperación de sesión con un límite de tiempo
                const result = await Promise.race([
                    supabase.auth.getSession(),
                    timeoutPromise
                ]);

                if (result === 'timeout') {
                    if (isMounted) setLoading(false);
                    return;
                }

                const { data: { session }, error } = result as any;
                
                if (error) throw error;

                if (isMounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
                
                if (session?.user && isMounted) {
                    // Cargamos el perfil en segundo plano sin bloquear el setLoading(false) inicial
                    ProfileRepository.getProfile(session.user.id)
                        .then(fetchedProfile => {
                            if (isMounted) setProfile(fetchedProfile);
                        })
                        .catch(() => {
                            if (isMounted) setProfile(null);
                        });
                }
            } catch (error) {
                // Silenciamos errores en producción para no ensuciar la consola, 
                // pero aseguramos que la app cargue
            } finally {
                if (isMounted) setLoading(false);
            }
            
            if (window.location.hash.includes('access_token')) {
                try {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                } catch (e) { /* Ignorar fallos de history API en móviles antiguos */ }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;

            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                const fetchedProfile = await ProfileRepository.getProfile(session.user.id);
                if (isMounted) {
                    setProfile(fetchedProfile);
                    setLoading(false);
                }
            } else {
                if (isMounted) {
                    setProfile(null);
                    setLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        if (!user) return;
        console.log('🔄 Refrescando perfil...');
        try {
            const fetchedProfile = await ProfileRepository.getProfile(user.id);
            setProfile(fetchedProfile);
            console.log('✅ Perfil refrescado exitosamente');
        } catch (error) {
            console.error('❌ Error al refrescar perfil:', error);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        session,
        user,
        profile,
        loading,
        refreshProfile,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
