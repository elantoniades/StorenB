'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/src/utils/supabase/server'

export const getCurrentUser = async () => {
  const supabase = createClient(cookies())

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  return {
    id: user.id,
    email: user.email,
  }
}
