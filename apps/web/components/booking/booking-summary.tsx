"use client";

import { Button } from "@/components/ui/button";

export default function BookingSummary({
  reservation,
}: {
  reservation: any;
}) {
  const payWithPaypal = async () => {
    const res = await fetch(
      "http://localhost:4000/api/payments/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          reservationId: reservation._id,
        }),
      }
    );

    const data = await res.json();
    window.location.href = data.approvalUrl;
  };

  return (
    <div className="min-h-screen bg-cream pt-28">
      <div className="mx-auto max-w-xl bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-serif mb-6">
          Reservation Summary
        </h1>

        <div className="space-y-2 text-sm">
          <p><strong>Hotel:</strong> {reservation.roomId.hotelId.name}</p>
          <p><strong>Room:</strong> {reservation.roomId.name}</p>
          <p><strong>Check-in:</strong> {reservation.checkIn}</p>
          <p><strong>Check-out:</strong> {reservation.checkOut}</p>
          <p className="text-lg font-semibold mt-4">
            Total: ${reservation.totalPrice}
          </p>
        </div>

        <Button
          onClick={payWithPaypal}
          className="w-full mt-8 bg-gold text-charcoal"
        >
          Pay with PayPal
        </Button>
      </div>
    </div>
  );
}
