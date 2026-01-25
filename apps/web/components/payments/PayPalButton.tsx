"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRef } from "react";
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
	const reservationIdRef = useRef<string | null>(null);

	return (
		<PayPalButtons
			createOrder={async () => {
				void totalPrice;
				const reservation = await createReservation(reservationPayload);
				reservationIdRef.current = reservation._id as string;
				const res = await api.post("/payments/create-order", {
					reservationId: reservation._id,
				});
				return res.data.id as string;
			}}
			onApprove={async (data) => {
				const reservationId = reservationIdRef.current;
				if (!reservationId) {
					throw new Error("Reservation not found for payment capture");
				}
				await api.post("/payments/capture-order", {
					orderId: data.orderID,
					reservationId,
				});

				onSuccess();
			}}
		/>
	);
}
