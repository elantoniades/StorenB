'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function getListingById(listingId: string) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookieStore }
  );

  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', listingId)
    .single();

  if (error) {
    console.error('Error fetching listing by id:', error.message);
    return null;
  }

  return data;
}
