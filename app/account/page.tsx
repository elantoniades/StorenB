import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cancelReservation } from "@/app/actions/cancelReservation";
import { format } from "date-fns";

export default async function MyReservations() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Πρέπει να συνδεθείς για να δεις τις κρατήσεις σου.</h1>
      </div>
    );
  }

  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("id, start_date, end_date, created_at, space_id, spaces(name, location)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-600">Αποτυχία ανάκτησης κρατήσεων.</h1>
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Δεν έχεις ενεργές κρατήσεις.</h1>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Οι κρατήσεις μου</h1>
      <ul className="space-y-4">
        {reservations.map((res: any) => (
          <li
            key={res.id}
            className="border p-4 rounded-md shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Χώρος: {res.spaces?.name || "Άγνωστος"} – {res.spaces?.location || "Τοποθεσία;"}
              </p>
              <p className="text-sm text-gray-600">
                Από: {format(new Date(res.start_date), "dd/MM/yyyy")} έως{" "}
                {format(new Date(res.end_date), "dd/MM/yyyy")}
              </p>
              <p className="text-xs text-gray-400">
                Ημερομηνία κράτησης: {format(new Date(res.created_at), "dd/MM/yyyy")}
              </p>
            </div>
            <form action={cancelReservation}>
              <input type="hidden" name="reservationId" value={res.id} />
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Ακύρωση
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
