"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { checkRoomAvailability, createReservation } from "@/lib/api";
import { type AvailabilityUpdatePayload, socket } from "@/lib/socket";
import type { Room } from "@/types/room";

export function RoomDetailSection({ room }: { room: Room }) {
	const MotionImage = motion(Image);

	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [roomsBooked, setRoomsBooked] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [summary, setSummary] = useState<null | {
		availableRooms: number;
		totalPrice: number;
	}>(null);
	const [loading, setLoading] = useState(false);
	const [remainingRooms, setRemainingRooms] = useState<number | null>(
		room.totalRooms ?? null,
	);

	/* 🔌 SOCKET: real-time availability */
	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		const handler = (data: AvailabilityUpdatePayload) => {
			if (data.roomId === room._id) {
				setRemainingRooms(data.remaining);
			}
		};

		socket.on("availability:update", handler);

		return () => {
			socket.off("availability:update", handler);
		};
	}, [room._id]);

	/* 1️⃣ CHECK AVAILABILITY */
	const checkAvailability = async () => {
		if (!checkIn || !checkOut) {
			setError("Please select check-in and check-out dates");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			const res = await checkRoomAvailability({
				roomTypeId: room._id,
				checkIn,
				checkOut,
			});

			if (res.availableRooms <= 0) {
				setError("No rooms available for selected dates");
				setSummary(null);
				return;
			}

			const nights =
				(new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
				(1000 * 60 * 60 * 24);

			setSummary({
				availableRooms: res.availableRooms,
				totalPrice: nights * room.pricePerNight * roomsBooked,
			});

			setRemainingRooms(res.availableRooms);

			if (roomsBooked > res.availableRooms) {
				setRoomsBooked(res.availableRooms);
			}
		} catch {
			setError("Failed to check availability");
		} finally {
			setLoading(false);
		}
	};
	// removed stray expression; availability is shown within JSX below

	/* 2️⃣ CONFIRM BOOKING */
	const confirmBooking = async () => {
		if (!summary) return;

		setLoading(true);
		try {
			await createReservation({
				roomTypeId: room._id,
				checkIn,
				checkOut,
				roomsBooked,
				adults: room.capacity,
			});

			alert(`Booking confirmed! Total: $${summary.totalPrice}`);

			setSummary(null);
			setCheckIn("");
			setCheckOut("");
			setRoomsBooked(1);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Booking failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* HERO IMAGE */}
			{room.images?.hero && (
				<section
					className="h-[60vh] bg-cover bg-center"
					style={{
						backgroundImage: `url(${room.images.hero})`,
					}}
				/>
			)}

			<section className="py-20 bg-cream">
				<div className="mx-auto max-w-5xl px-6">
					<h1 className="text-4xl font-serif mb-4">{room.name}</h1>

					<p className="text-charcoal/70 max-w-3xl">{room.description}</p>

					{/* LIVE AVAILABILITY */}
					{remainingRooms !== null && (
						<p className="mt-2 text-sm text-charcoal/70">
							{remainingRooms} rooms left
						</p>
					)}

					{/* DATE PICKERS */}
					<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
						<input
							type="date"
							value={checkIn}
							onChange={(e) => setCheckIn(e.target.value)}
							className="border p-3 rounded-lg"
						/>
						<input
							type="date"
							value={checkOut}
							onChange={(e) => setCheckOut(e.target.value)}
							className="border p-3 rounded-lg"
						/>
					</div>

					{/* ROOMS COUNT */}
					{summary && (
						<div className="mt-4 flex items-center gap-4">
							<label htmlFor="rooms-count" className="font-medium">
								Rooms to book
							</label>
							<input
								id="rooms-count"
								type="number"
								min={1}
								max={summary.availableRooms}
								value={roomsBooked}
								onChange={(e) =>
									setRoomsBooked(
										Math.min(Number(e.target.value), summary.availableRooms),
									)
								}
								className="w-20 border p-2 rounded-lg"
							/>
						</div>
					)}

					{error && <p className="mt-4 text-red-600">{error}</p>}

					<div className="mt-6">
						{!summary ? (
							<Button onClick={checkAvailability} disabled={loading}>
								{loading ? "Checking..." : "Check Availability"}
							</Button>
						) : (
							<Button onClick={confirmBooking} disabled={loading}>
								{loading
									? "Booking..."
									: `Confirm Booking ($${summary.totalPrice})`}
							</Button>
						)}
					</div>

					{/* GALLERY */}
					{room.images?.gallery?.length > 0 && (
						<div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
							{room.images.gallery.map((img, i) => (
								<div
									key={img}
									className="relative rounded-xl overflow-hidden w-full h-80"
								>
									<MotionImage
										src={img}
										alt={`${room.name} ${i + 1}`}
										fill
										sizes="(min-width: 768px) 50vw, 100vw"
										className="object-cover"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
