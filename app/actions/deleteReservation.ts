// app/actions/deleteReservation.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function deleteReservation(reservationId: string) {
  const supabase = createClient(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  // Βρίσκουμε την κράτηση και την αντιστοιχία στον χώρο
  const { data: reservation } = await supabase
    .from('reservations')
    .select('id, space_id, spaces(user_id)')
    .eq('id', reservationId)
    .single();

  if (!reservation || reservation.spaces?.user_id !== user.id) {
    return { error: 'Not authorized to delete this reservation' };
  }

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
