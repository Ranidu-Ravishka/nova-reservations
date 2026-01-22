"use client";

import { motion } from "framer-motion";
import { ArrowRight, Maximize, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import type { ImageSet } from "@/types/images";

/* ---------------- TYPES ---------------- */

interface Room {
	_id: string;
	name: string;
	description: string;
	pricePerNight: number;
	occupancy?: number;
	size?: string;
	images: ImageSet;
	hotelId: string;
}

/* ---------------- COMPONENT ---------------- */

export function RoomsListingSection() {
	const searchParams = useSearchParams();
	const hotelId = searchParams.get("hotel");

	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);

	/* ---------------- FETCH ROOMS (FIXED) ---------------- */

	useEffect(() => {
		setLoading(true);

		const url = new URL(`${API_BASE_URL}/api/rooms`);
		if (hotelId) url.searchParams.set("hotelId", hotelId);

		fetch(url.toString())
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch rooms");
				return res.json();
			})
			.then(setRooms)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [hotelId]);

	if (loading) {
		return <div className="p-10 text-charcoal/60">Loading rooms…</div>;
	}

	return (
		<section className="py-16 bg-cream">
			<div className="mx-auto max-w-7xl px-6">
				{rooms.length === 0 ? (
					<div className="text-center text-charcoal/60 py-20">
						No rooms available.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{rooms.map((room, index) => (
							<motion.div
								key={room._id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
							>
								<Link href={`/rooms/${room._id}`}>
									<div className="bg-card rounded-2xl overflow-hidden shadow hover:shadow-lg">
										<div className="relative h-64 w-full">
											<Image
												src={
													room.images?.listing ||
													room.images?.hero ||
													"/placeholder.svg"
												}
												alt={room.name}
												fill
												sizes="(min-width: 768px) 50vw, 100vw"
												className="object-cover"
												unoptimized
											/>
										</div>

										<div className="p-6">
											<h3 className="text-2xl font-serif">{room.name}</h3>
											<p className="text-charcoal/60 mt-2">
												{room.description}
											</p>

											<div className="flex gap-6 text-sm mt-4 text-charcoal/50">
												{room.occupancy && (
													<span className="flex gap-2">
														<Users className="w-4 h-4" />
														{room.occupancy} Guests
													</span>
												)}
												{room.size && (
													<span className="flex gap-2">
														<Maximize className="w-4 h-4" />
														{room.size} sq ft
													</span>
												)}
											</div>

											<div className="mt-4 text-gold font-medium flex items-center gap-2">
												View Details <ArrowRight className="w-5 h-5" />
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
