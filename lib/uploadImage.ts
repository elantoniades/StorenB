import { supabase } from './supabaseClient';

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('spaces')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  return supabase.storage.from('spaces').getPublicUrl(data.path).data.publicUrl;
}
