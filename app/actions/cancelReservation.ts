"use server";

import { createClient } from "@/src/utils/supabase/server";
import { cookies } from "next/headers";

export const cancelReservation = async (reservationId: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Μη εξουσιοδοτημένη πρόσβαση." };
  }

  const { error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", reservationId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Αποτυχία ακύρωσης κράτησης." };
  }

  return { success: true };
};
