
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { ProfileRepository, UserProfile } from '../api/repositories/ProfileRepository';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
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
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                const fetchedProfile = await ProfileRepository.getProfile(session.user.id);
                setProfile(fetchedProfile);
            } else {
                setProfile(null);
            }
            
            setLoading(false);
            if (session && window.location.hash.includes('access_token')) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        };

        initializeAuth();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
                const fetchedProfile = await ProfileRepository.getProfile(session.user.id);
                setProfile(fetchedProfile);
            } else {
                setProfile(null);
            }
            
            setLoading(false);
            if (session && window.location.hash.includes('access_token')) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        session,
        user,
        profile,
        loading,
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
