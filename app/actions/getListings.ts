'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
}

export async function getListings(params: IListingsParams) {
  const supabase = createServerComponentClient({ cookies });

  const { userId, location, category } = params;

  let query = supabase.from('spaces').select('*');

  if (userId) {
    query = query.eq('owner_id', userId);
  }

  if (location) {
    query = query.ilike('location', `%${location}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error.message);
    return [];
  }

  return data || [];
}
