'use server';

import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export async function createSpace(data: any) {
  const supabase = createClient(cookies());

  const { error } = await supabase.from('spaces').insert([data]);

  if (error) throw new Error(error.message);
}
