"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { createClient } from "@/utils/supabase/server";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ReservationCard from "@/components/reservations/ReservationCard";

const ReservationsPage = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const supabase = createClient();
      const user = await getCurrentUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*, space:spaces(*), user:users(*)")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
      } else {
        setReservations(data);
      }

      setLoading(false);
    };

    fetchReservations();
  }, []);

  return (
    <Container>
      <Heading title="Οι κρατήσεις μου" subtitle="Διαχειρίσου τις κρατήσεις σου εύκολα." />
      {loading ? (
        <p>Φόρτωση...</p>
      ) : reservations.length === 0 ? (
        <p>Δεν υπάρχουν κρατήσεις ακόμα.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reservations.map((reservation: any) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={() => console.log("Cancel", reservation.id)}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default ReservationsPage;
