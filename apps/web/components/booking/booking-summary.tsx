"use client";

import { Button } from "@/components/ui/button";

type Reservation = {
	_id: string;
	hotelName: string;
	roomName: string;
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
		const res = await fetch("/api/payments", {
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
		<div className="min-h-screen bg-neutral-950 px-6 pb-24 pt-24 text-white">
			<div className="mx-auto max-w-5xl">
				<div className="mb-10">
					<p className="text-xs uppercase tracking-[0.3em] text-white/60">
						Reservation
					</p>
					<h1 className="mt-3 text-3xl font-light tracking-tight">
						Your stay, perfectly composed.
					</h1>
					<p className="mt-2 text-sm text-white/60">
						Review details and proceed to secure payment.
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="rounded-3xl border border-indigo-50 bg-indigo-50 p-8">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-white/50">
									Hotel
								</p>
								<p className="mt-2 text-xl font-medium">
									{reservation.hotelName}
								</p>
							</div>
							<p className="text-sm text-indigo-50">Reservation details</p>
						</div>

						<div className="mt-6 grid gap-6 sm:grid-cols-2">
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
								<p className="text-xs uppercase tracking-[0.25em] text-white/50">
									Room
								</p>
								<p className="mt-2 text-base">{reservation.roomName}</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
								<p className="text-xs uppercase tracking-[0.25em] text-white/50">
									Stay
								</p>
								<p className="mt-2 text-base">
									{reservation.checkIn} → {reservation.checkOut}
								</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
								<p className="text-xs uppercase tracking-[0.25em] text-white/50">
									Concierge
								</p>
								<p className="mt-2 text-base">24/7 private line</p>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4">
								<p className="text-xs uppercase tracking-[0.25em] text-white/50">
									Arrival service
								</p>
								<p className="mt-2 text-base">Private transfer</p>
							</div>
						</div>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/95 p-8 text-neutral-900">
						<div className="flex items-center justify-between">
							<p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
								Total due
							</p>
							<p className="text-sm text-neutral-500">PayPal secured</p>
						</div>
						<p className="mt-4 text-3xl font-light">
							${reservation.totalPrice}
						</p>
						<p className="mt-2 text-xs text-neutral-500">
							Includes taxes, fees, and premium service coverage.
						</p>

						<Button
							onClick={payWithPaypal}
							className="mt-8 w-full rounded-full bg-neutral-900 py-6 text-base font-medium text-white hover:bg-neutral-800"
						>
							Pay with PayPal
						</Button>
						<p className="mt-4 text-xs text-neutral-500">
							You will be redirected to complete the payment securely.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
