"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface Reservation {
	_id: string;
	status: "PENDING" | "CONFIRMED" | "CANCELLED";
	paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	hotelName: string;
	roomName: string;
	roomsBooked: number;
}

export default function BookingConfirmationPage() {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const reservationId = useMemo(() => params?.id, [params]);

	const [reservation, setReservation] = useState<Reservation | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!reservationId) return;
		const token = localStorage.getItem("token");

		setLoading(true);
		setError(null);
		fetch(`/api/reservations/${reservationId}`, {
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		})
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Failed to load reservation");
				}
				return res.json();
			})
			.then(setReservation)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : "Failed to load");
			})
			.finally(() => setLoading(false));
	}, [reservationId]);

	return (
		<div className="min-h-screen bg-cream pt-24">
			<div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow">
				<h1 className="text-2xl font-serif">
					{reservation?.status === "CONFIRMED" &&
					reservation.paymentStatus === "PAID"
						? "Booking Confirmed"
						: "Reservation Status"}
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					{reservation?.status === "CONFIRMED" &&
					reservation.paymentStatus === "PAID"
						? "Your payment has been processed successfully."
						: "Payment is not confirmed. Check the reservation status below."}
				</p>

				{loading ? (
					<p className="mt-6 text-sm text-muted-foreground">
						Loading reservation details…
					</p>
				) : error ? (
					<p className="mt-6 text-sm text-destructive">{error}</p>
				) : reservation ? (
					<div className="mt-6 space-y-2 text-sm">
						<p>
							<strong>Hotel:</strong> {reservation.hotelName}
						</p>
						<p>
							<strong>Room:</strong> {reservation.roomName}
						</p>
						<p>
							<strong>Dates:</strong>{" "}
							{new Date(reservation.checkIn).toLocaleDateString()} →{" "}
							{new Date(reservation.checkOut).toLocaleDateString()}
						</p>
						<p>
							<strong>Rooms:</strong> {reservation.roomsBooked}
						</p>
						<p className="text-lg font-semibold">
							Total: ${reservation.totalPrice}
						</p>
						<p>
							<strong>Status:</strong> {reservation.status}
						</p>
					</div>
				) : null}

				<Button
					className="mt-8 w-full bg-gold text-charcoal"
					onClick={() => router.push("/")}
				>
					Okay
				</Button>
			</div>
		</div>
	);
}
