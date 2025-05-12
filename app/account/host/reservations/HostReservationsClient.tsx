"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import Heading from "@/components/Heading";
import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";
import { SafeReservation, SafeUser } from "@/types";
import { deleteReservation } from "@/app/actions/deleteReservation";

interface HostReservationsClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const HostReservationsClient: React.FC<HostReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onCancel = (id: string) => {
    startTransition(() => {
      deleteReservation(id).then((result) => {
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Reservation cancelled");
          router.refresh();
        }
      });
    });
  };

  return (
    <Container>
      <Heading
        title="Reservations for your spaces"
        subtitle="Manage reservations on your listings"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.space}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={isPending}
            actionLabel="Cancel guest reservation"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default HostReservationsClient;
