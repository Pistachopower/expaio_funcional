import { supabase } from '../../lib/supabaseClient';

export interface UserProfile {
    id: string;
    nombre: string | null;
    apellido: string | null;
    fecha_nacimiento: string | null;
    genero: string | null;
    foto_url: string | null;
    pais_origen_id: string | null;
    ciudad_origen_id: string | null;
    idioma_preferido: string | null;
    telefono: string | null;
    descripcion: string | null;
    pais_destino_id: string | null;
    username: string | null;
    acepta_marketing: boolean;
    como_nos_conocio?: string;
    rol: string;
    estado_cuenta: string;
    fecha_actualizacion: string | null;
    email?: string;
}

export const ProfileRepository = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('perfiles')
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
            .from('perfiles')
            .update(profile)
            .eq('id', userId);

        if (error) {
            throw error;
        }

        return data;
    }
};
