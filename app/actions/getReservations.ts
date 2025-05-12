import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getHostReservations() {
  const supabase = createServerComponentClient({ cookies });

  // Βρες τον current user (Host)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Host not authenticated", userError);
    return [];
  }

  // Φέρε τις κρατήσεις για τους χώρους που έχει ανεβάσει ο Host
  const { data: reservations, error: reservationsError } = await supabase
    .from("reservations")
    .select("*, space_id(*), user_id(*)")
    .eq("space_id.owner_id", user.id) // μόνο για χώρους που ανήκουν στον host
    .order("created_at", { ascending: false });

  if (reservationsError) {
    console.error("Failed to fetch host reservations", reservationsError);
    return [];
  }

  return reservations;
}
