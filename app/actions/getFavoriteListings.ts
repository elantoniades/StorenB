'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function getFavoriteListings(userId: string) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookieStore }
  );

  // 1. Πάρε όλα τα favorite space_ids για τον χρήστη
  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('space_id')
    .eq('user_id', userId);

  if (favError || !favorites || favorites.length === 0) {
    console.error('Error fetching favorites:', favError?.message);
    return [];
  }

  const spaceIds = favorites.map((fav) => fav.space_id);

  // 2. Φέρε τις αντίστοιχες καταχωρίσεις από τον πίνακα spaces
  const { data: listings, error } = await supabase
    .from('spaces')
    .select('*')
    .in('id', spaceIds);

  if (error) {
    console.error('Error fetching listings:', error.message);
    return [];
  }

  return listings || [];
}
