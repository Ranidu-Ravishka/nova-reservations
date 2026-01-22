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

		fetch("http://localhost:4000/api/payments/execute", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				paymentId,
				PayerID: payerId,
				reservationId,
			}),
		}).then(() => router.push("/profile/reservations"));
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
