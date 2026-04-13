
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
        // Check active sessions and sets the user
        const initializeAuth = async () => {
            console.log('🔄 Autenticación: Iniciando verificación de sesión...');
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) {
                    console.error('❌ Error obteniendo sesión:', sessionError);
                    throw sessionError;
                }

                console.log('✅ Sesión recuperada:', session ? 'Usuario autenticado' : 'Sin sesión activa');
                setSession(session);
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    console.log('🔄 Perfil: Cargando datos para el usuario:', session.user.id);
                    try {
                        const fetchedProfile = await ProfileRepository.getProfile(session.user.id);
                        console.log('✅ Perfil cargado:', fetchedProfile ? 'Existente' : 'No encontrado');
                        setProfile(fetchedProfile);
                    } catch (profileError) {
                        console.error('❌ Error cargando perfil:', profileError);
                        setProfile(null);
                    }
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error('💥 Error crítico en inicialización de Auth:', error);
            } finally {
                console.log('🏁 Autenticación: Inicialización completada.');
                setLoading(false);
            }
            
            if (window.location.hash.includes('access_token')) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        };

        initializeAuth();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔔 Evento de Auth detectado:', event);
            try {
                setSession(session);
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    const fetchedProfile = await ProfileRepository.getProfile(session.user.id);
                    setProfile(fetchedProfile);
                } else {
                    setProfile(null);
                    setLoading(false); // Ensure loading is off if signed out
                }
            } catch (error) {
                console.error('❌ Error en cambio de estado de Auth:', error);
            } finally {
                setLoading(false);
            }
            
            if (session && window.location.hash.includes('access_token')) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        });

        return () => subscription.unsubscribe();
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
