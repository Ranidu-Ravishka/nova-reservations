"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
	const router = useRouter();
	const [reservationId, setReservationId] = useState<string | null>(null);

	useEffect(() => {
		setReservationId(
			new URLSearchParams(window.location.search).get("reservation"),
		);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-cream">
			<div className="rounded-2xl bg-white p-8 shadow">
				<h1 className="text-2xl font-serif">Payment Cancelled</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Your payment was cancelled. The reservation remains unpaid. You can
					retry payment or cancel the reservation from My Reservations.
				</p>
				{reservationId ? (
					<Button
						className="mt-6 w-full"
						onClick={() =>
							router.push(`/booking/${encodeURIComponent(reservationId)}`)
						}
					>
						Retry payment
					</Button>
				) : null}
				<Button
					className="mt-3 w-full"
					onClick={() => router.push("/profile/reservations")}
				>
					View my reservations
				</Button>
			</div>
		</div>
	);
}
