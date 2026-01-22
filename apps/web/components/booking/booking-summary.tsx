"use client";

import { Button } from "@/components/ui/button";

type Reservation = {
	_id: string;
	roomId: {
		name: string;
		hotelId: {
			name: string;
		};
	};
	checkIn: string;
	checkOut: string;
	totalPrice: number;
};

type BookingSummaryProps = {
	reservation: Reservation;
};

type CreatePaymentResponse = {
	approvalUrl: string;
};

export default function BookingSummary({ reservation }: BookingSummaryProps) {
	const payWithPaypal = async () => {
		const token = localStorage.getItem("token");
		const res = await fetch("/api/payments/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({
				reservationId: reservation._id,
			}),
		});

		if (!res.ok) {
			throw new Error("Failed to create PayPal payment");
		}

		const data: CreatePaymentResponse = await res.json();
		if (!data?.approvalUrl) {
			throw new Error("PayPal approval URL missing");
		}
		window.location.href = data.approvalUrl;
	};

	return (
		<div className="min-h-screen bg-cream pt-28">
			<div className="mx-auto max-w-xl bg-white p-8 rounded-2xl shadow">
				<h1 className="text-2xl font-serif mb-6">Reservation Summary</h1>

				<div className="space-y-2 text-sm">
					<p>
						<strong>Hotel:</strong> {reservation.roomId.hotelId.name}
					</p>
					<p>
						<strong>Room:</strong> {reservation.roomId.name}
					</p>
					<p>
						<strong>Check-in:</strong> {reservation.checkIn}
					</p>
					<p>
						<strong>Check-out:</strong> {reservation.checkOut}
					</p>
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
