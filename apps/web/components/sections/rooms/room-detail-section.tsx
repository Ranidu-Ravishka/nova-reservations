"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Room {
	_id: string;
	name: string;
	pricePerNight: number;
	amenities: string[];
	images: string[];
}

export function RoomDetailSection({ room }: { room: Room }) {
	return (
		<div className="p-10">
			<h1 className="text-3xl font-bold">{room.name}</h1>
			<p className="mt-2 text-lg">${room.pricePerNight} / night</p>

			<Link href="/booking">
				<Button className="mt-6">Book Now</Button>
			</Link>
		</div>
	);
}
