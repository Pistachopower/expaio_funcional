import { supabase } from '../../lib/supabaseClient';

export interface CountryGuide {
    id: string;
    pais_id: string | null;
    pais_origen_id: string | null;
    tipo_guia: string;
    titulo: string;
    subtitulo: string | null;
    contenido_markdown: string;
    glosario_json: any[];
    ejemplo_vvisual_json: any;
    fecha_actualizacion: string;
}

export const GuideRepository = {
    async getGuideContent(targetId: string | null, guideType: string, originId: string | null = null): Promise<CountryGuide | null> {
        // PRIORITY 1: Specific Origin + Target
        if (targetId && originId) {
            const { data } = await supabase
                .from('guias_paises')
                .select('*')
                .eq('pais_id', targetId)
                .eq('pais_origen_id', originId)
                .eq('tipo_guia', guideType)
                .maybeSingle();
            
            if (data) return data;
        }

        // PRIORITY 2: Target Only (General for this country)
        if (targetId) {
            const { data } = await supabase
                .from('guias_paises')
                .select('*')
                .eq('pais_id', targetId)
                .is('pais_origen_id', null)
                .eq('tipo_guia', guideType)
                .maybeSingle();
            
            if (data) return data;
        }

        // PRIORITY 3: Global Fallback (pais_id is null)
        const { data, error } = await supabase
            .from('guias_paises')
            .select('*')
            .is('pais_id', null)
            .is('pais_origen_id', null)
            .eq('tipo_guia', guideType)
            .maybeSingle();

        if (error) {
            console.error(`Error fetching guide fallback ${guideType}:`, error);
            return null;
        }

        return data;
    },

    async getAllGuidesForCountry(countryId: string): Promise<CountryGuide[]> {
        const { data, error } = await supabase
            .from('guias_paises')
            .select('*')
            .eq('pais_id', countryId);

        if (error) {
            console.error(`Error fetching all guides for country ${countryId}:`, error);
            return [];
        }

        return data || [];
    }
};
