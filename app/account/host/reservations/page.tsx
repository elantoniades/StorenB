import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getReservations } from "@/app/actions/getReservations";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ReservationsClient from "@/components/reservations/ReservationsClient";

export default async function HostReservationsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Μη εξουσιοδοτημένο" subtitle="Παρακαλώ συνδεθείτε." />;
  }

  const reservations = await getReservations({ hostId: currentUser.id });

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="Καμία κράτηση"
        subtitle="Δεν έχουν γίνει ακόμα κρατήσεις στους χώρους σας."
      />
    );
  }

  return (
    <Container>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </Container>
  );
}
