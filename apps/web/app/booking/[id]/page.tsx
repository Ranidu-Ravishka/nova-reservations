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
				if (!res.ok) return null;
				return res.json();
			})
			.then((data) => setReservation(data))
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
				Reservation not found.
			</div>
		);
	}

	return <BookingSummary reservation={reservation} />;
}
