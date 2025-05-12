"use client";

import { format } from "date-fns";
import { el } from "date-fns/locale";
import { useState } from "react";

import Button from "@/components/Button";

interface ReservationCardProps {
  reservation: any;
  onCancel: (id: string) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setLoading(true);
    onCancel(reservation.id);
  };

  const startDate = format(new Date(reservation.start_date), "dd MMMM yyyy", { locale: el });
  const endDate = format(new Date(reservation.end_date), "dd MMMM yyyy", { locale: el });

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white">
      <h3 className="text-lg font-semibold mb-1">{reservation.space?.title || "Αποθηκευτικός Χώρος"}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Τοποθεσία: {reservation.space?.location || "—"}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        Ημερομηνίες: {startDate} – {endDate}
      </p>
      <p className="text-sm text-gray-600 mb-3">
        Καταχωρητής: {reservation.space?.user?.email || "—"}
      </p>
      <Button
        disabled={loading}
        small
        label={loading ? "Ακύρωση..." : "Ακύρωση Κράτησης"}
        onClick={handleCancel}
      />
    </div>
  );
};

export default ReservationCard;
