import { supabase } from '../../lib/supabaseClient';

export interface UserProfile {
    id: string;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
    canton: string | null;
    permit: string | null;
    arrival_date: string | null;
    sector: string | null;
    studies: string | null;
    phone: string | null;
    age: number | null;
    is_spanish: boolean | null;
    origin: string | null;
    purpose: string | null;
    family_status: string | null;
    occupation: string | null;
    email?: string;
}

export const ProfileRepository = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    },

    async updateProfile(userId: string, profile: Partial<UserProfile>) {
        const { data, error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', userId);

        if (error) {
            throw error;
        }

        return data;
    }
};
