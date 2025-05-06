'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/src/utils/supabase/server';

export async function getCurrentUser() {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
