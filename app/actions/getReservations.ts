'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface IParams {
  spaceId?: string;
  userId?: string;
  hostId?: string;
}

export default async function getReservations(params: IParams) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookieStore }
  );

  const { spaceId, userId, hostId } = params;

  // Αν ζητείται hostId, φέρε όλα τα listings του host
  if (hostId) {
    const { data: hostSpaces, error: hostErr } = await supabase
      .from('spaces')
      .select('id')
      .eq('owner_id', hostId);

    if (hostErr || !hostSpaces) {
      console.error('Error fetching host spaces:', hostErr?.message);
      return [];
    }

    const spaceIds = hostSpaces.map((s) => s.id);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .in('space_id', spaceIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations for host:', error.message);
      return [];
    }

    return data || [];
  }

  // Αν ζητείται spaceId
  if (spaceId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations for space:', error.message);
      return [];
    }

    return data || [];
  }

  // Αν ζητείται userId
  if (userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('renter_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations for user:', error.message);
      return [];
    }

    return data || [];
  }

  return [];
}
