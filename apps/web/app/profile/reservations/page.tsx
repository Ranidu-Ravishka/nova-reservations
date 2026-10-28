"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface Reservation {
	_id: string;
	hotelName: string;
	roomName: string;
	checkIn: string;
	checkOut: string;
	roomsBooked: number;
	totalPrice: number;
	status: "PENDING" | "CONFIRMED" | "CANCELLED";
	paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
}

export default function MyReservationsPage() {
	const router = useRouter();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [cancelError, setCancelError] = useState<{
		id: string;
		message: string;
	} | null>(null);

	const load = useCallback(async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/reservations/me", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to load reservations");
			}
			const data = (await res.json()) as Reservation[];
			setReservations(data);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Failed to load");
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		load();
	}, [load]);

	const { ongoing, past } = useMemo(() => {
		const today = new Date();
		const ongoing = reservations.filter((r) => {
			const checkout = new Date(r.checkOut);
			return r.status !== "CANCELLED" && checkout >= today;
		});
		const past = reservations.filter((r) => {
			const checkout = new Date(r.checkOut);
			return r.status === "CANCELLED" || checkout < today;
		});
		return { ongoing, past };
	}, [reservations]);

	const cancelReservation = async (id: string) => {
		const token = localStorage.getItem("token");
		if (!token) {
			setCancelError({ id, message: "Sign in to cancel this reservation." });
			return;
		}

		setCancelError(null);
		try {
			const response = await fetch(`/api/reservations/${id}/cancel`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				const body = await response.json().catch(() => null);
				setCancelError({
					id,
					message:
						typeof body?.message === "string"
							? body.message
							: "Failed to cancel reservation.",
				});
				return;
			}

			setReservations((previous) =>
				previous.map((reservation) =>
					reservation._id === id
						? { ...reservation, status: "CANCELLED" }
						: reservation,
				),
			);
		} catch {
			setCancelError({
				id,
				message: "Could not reach the server. Please try again.",
			});
		}
	};

	const renderCard = (reservation: Reservation) => {
		const isCancelable =
			reservation.status !== "CANCELLED" &&
			new Date(reservation.checkIn) > new Date();

		return (
			<div
				key={reservation._id}
				className="rounded-2xl border bg-white p-6 shadow-sm"
			>
				<div className="flex flex-col gap-2">
					<h3 className="text-lg font-semibold">
						{reservation.hotelName} · {reservation.roomName}
					</h3>
					<p className="text-sm text-muted-foreground">
						{new Date(reservation.checkIn).toLocaleDateString()} →{" "}
						{new Date(reservation.checkOut).toLocaleDateString()}
					</p>
					<p className="text-sm">
						Rooms: {reservation.roomsBooked} · Total: ${reservation.totalPrice}
					</p>
					<p className="text-xs uppercase tracking-wide text-muted-foreground">
						{reservation.status} · {reservation.paymentStatus || "UNPAID"}
					</p>
				</div>
				<Link
					className="mt-4 inline-block text-sm underline"
					href={`/booking/${reservation._id}`}
				>
					View reservation
				</Link>
				{cancelError?.id === reservation._id ? (
					<p className="mt-2 text-sm text-destructive">{cancelError.message}</p>
				) : null}
				{isCancelable ? (
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => cancelReservation(reservation._id)}
					>
						Cancel reservation
					</Button>
				) : null}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-cream pt-24">
			<div className="mx-auto max-w-5xl px-6">
				<h1 className="text-3xl font-serif">My Reservations</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Track your upcoming stays and past bookings.
				</p>

				{loading ? (
					<p className="mt-6 text-sm text-muted-foreground">
						Loading reservations…
					</p>
				) : error ? (
					<p className="mt-6 text-sm text-destructive">{error}</p>
				) : (
					<div className="mt-8 space-y-8">
						<div>
							<h2 className="text-xl font-semibold">Ongoing</h2>
							<div className="mt-4 grid gap-4">
								{ongoing.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No upcoming reservations.
									</p>
								) : (
									ongoing.map(renderCard)
								)}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold">Past</h2>
							<div className="mt-4 grid gap-4">
								{past.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										No past reservations.
									</p>
								) : (
									past.map(renderCard)
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
