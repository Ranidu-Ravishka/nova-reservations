"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/hotel";

type Props = {
	hotels: Hotel[];
};

export function AvailabilitySearch({ hotels }: Props) {
	const [hotelId, setHotelId] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const search = async () => {
		setError(null);

		if (!hotelId || !checkIn || !checkOut) {
			setError("Please select hotel and dates");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/availability/search?` +
					new URLSearchParams({
						hotelId,
						checkIn,
						checkOut,
						rooms: "1",
						adults: "2",
					}),
			);

			if (!res.ok) throw new Error("Failed");

			const data = await res.json();
			console.log("Availability:", data);
		} catch {
			setError("Availability search failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
			<select
				value={hotelId}
				onChange={(e) => setHotelId(e.target.value)}
				className="bg-transparent text-sm outline-none"
			>
				<option value="">Destination</option>
				{hotels.map((h) => (
					<option key={h._id} value={h._id}>
						{h.name}
					</option>
				))}
			</select>

			<input
				type="date"
				value={checkIn}
				onChange={(e) => setCheckIn(e.target.value)}
				className="text-sm outline-none"
			/>

			<input
				type="date"
				value={checkOut}
				onChange={(e) => setCheckOut(e.target.value)}
				className="text-sm outline-none"
			/>

			<Button size="sm" onClick={search} disabled={loading}>
				{loading ? "Checking..." : "Search"}
			</Button>

			{error && <span className="text-xs text-red-500">{error}</span>}
		</div>
	);
}
