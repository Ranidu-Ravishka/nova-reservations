"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function PaymentSuccessContent() {
	const params = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const paymentId = params.get("paymentId");
		const payerId = params.get("PayerID");
		const reservationId = params.get("reservation");

		if (!paymentId || !payerId || !reservationId) {
			router.push("/profile/reservations");
			return;
		}

		const token = localStorage.getItem("token");
		fetch("/api/payments/execute", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({
				paymentId,
				PayerID: payerId,
				reservationId,
			}),
		})
			.then((response) => {
				if (!response.ok) throw new Error("Payment execution failed");
				router.push(`/booking/confirmation/${reservationId}`);
			})
			.catch(() => router.push("/profile/reservations"));
	}, [params, router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			Processing payment...
		</div>
	);
}

export default function PaymentSuccess() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					Processing payment...
				</div>
			}
		>
			<PaymentSuccessContent />
		</Suspense>
	);
}
