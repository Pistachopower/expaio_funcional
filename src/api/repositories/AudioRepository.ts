import { supabase } from '../../lib/supabaseClient';

export const getSignedAudioUrl = async (filename: string): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from('feature_integracion')
    .createSignedUrl(filename, 60 * 60); // 1 hora de validez

  if (error) {
    console.error('Error obteniendo URL firmada:', error.message);
    return null;
  }
  return data?.signedUrl || null;
};
