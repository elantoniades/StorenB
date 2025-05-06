'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/src/utils/supabase/server';

export interface IListingsParams {
  userId?: string;
}

export async function getListings(params: IListingsParams) {
  const cookieStore = cookies();
  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
