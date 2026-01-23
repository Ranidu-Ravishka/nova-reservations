"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/profile/reservations");
		}, 3000);
		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-cream">
			<div className="rounded-2xl bg-white p-8 shadow">
				<h1 className="text-2xl font-serif">Payment Cancelled</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Your payment was cancelled. You can try again anytime.
				</p>
				<Button
					className="mt-6 w-full"
					onClick={() => router.push("/profile/reservations")}
				>
					View my reservations
				</Button>
			</div>
		</div>
	);
}
