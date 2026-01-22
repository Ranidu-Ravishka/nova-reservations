"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { api, createReservation } from "@/lib/api";

export function PayPalButton({
  totalPrice,
  reservationPayload,
  onSuccess,
}: {
  totalPrice: number;
  reservationPayload: {
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    roomsBooked: number;
    adults: number; // ✅ ADD THIS
  };
  onSuccess: () => void;
}) {
  return (
    <PayPalButtons
      createOrder={async () => {
        const res = await api.post("/payments/create", { totalPrice });
        return res.data.id;
      }}
      onApprove={async (data) => {
        await api.post("/payments/capture", {
          orderId: data.orderID,
        });

        // ✅ Now TS is happy
        await createReservation(reservationPayload);

        onSuccess();
      }}
    />
  );
}
