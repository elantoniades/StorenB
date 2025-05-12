// File: /app/actions/createReservation.ts

'use server';

import { createServerClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

interface ReservationParams {
  spaceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export async function createReservation({
  spaceId,
  userId,
  startDate,
  endDate,
  totalPrice,
}: ReservationParams) {
  const supabase = createServerClient(cookies());

  // Optional: check if space is already reserved on those dates
  const { data: existing, error: checkError } = await supabase
    .from('reservations')
    .select('*')
    .eq('space_id', spaceId)
    .or(`start_date.eq.${startDate},end_date.eq.${endDate}`);

  if (checkError) {
    console.error('[Supabase - Check Error]', checkError);
    return { error: 'Failed to check for existing reservations.' };
  }

  if (existing && existing.length > 0) {
    return { error: 'This space is already reserved for the selected dates.' };
  }

  const { error } = await supabase.from('reservations').insert({
    space_id: spaceId,
    user_id: userId,
    start_date: startDate,
    end_date: endDate,
    total_price: totalPrice,
  });

  if (error) {
    console.error('[Supabase - Insert Error]', error);
    return { error: 'Reservation could not be created.' };
  }

  return { success: true };
}
