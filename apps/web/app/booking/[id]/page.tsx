"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BookingSummary from "@/components/booking/booking-summary";

type Reservation = {
	_id: string;
	hotelName: string;
	roomName: string;
	checkIn: string;
	checkOut: string;
	totalPrice: number;
};

export default function BookingPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const [reservation, setReservation] = useState<Reservation | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!params?.id) return;
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		fetch(`/api/reservations/${params.id}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then(async (res) => {
				if (!res.ok) {
					setError(
						res.status === 404
							? "Reservation not found."
							: "Failed to load reservation.",
					);
					return null;
				}
				return res.json();
			})
			.then((data) => setReservation(data))
			.catch(() => {
				setError("Could not reach the server. Please try again.");
			})
			.finally(() => setLoading(false));
	}, [params, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading reservation…
			</div>
		);
	}

	if (!reservation) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				{error || "Reservation not found."}
			</div>
		);
	}

	return <BookingSummary reservation={reservation} />;
}
