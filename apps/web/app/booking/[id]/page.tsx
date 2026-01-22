import { notFound } from "next/navigation";
import { fetchReservationById } from "@/lib/api";
import BookingSummary from "@/components/booking/booking-summary";

export default async function BookingPage({
  params,
}: {
  params: { id: string };
}) {
  const reservation = await fetchReservationById(params.id);

  if (!reservation) notFound();

  return <BookingSummary reservation={reservation} />;
}
