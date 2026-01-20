"use client";
import { ImageSet } from "@/types/images";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Maximize,
	SlidersHorizontal,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

/* ---------------- TYPES (MATCH API) ---------------- */

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

	const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
	const [capacity, setCapacity] = useState("all");
	const [showFilters, setShowFilters] = useState(false);

	/* ---------------- FETCH ROOMS ---------------- */

	useEffect(() => {
		setLoading(true);

		const url = new URL("http://localhost:4000/api/rooms");

		if (hotelId) {
			url.searchParams.set("hotelId", hotelId); // ✅ FIXED
		}

		fetch(url.toString())
			.then((res) => res.json())
			.then(setRooms)
			.finally(() => setLoading(false));
	}, [hotelId]);

	/* ---------------- FILTER ---------------- */

	const filteredRooms = rooms.filter((room) => {
		const matchesPrice =
			room.pricePerNight >= priceRange[0] &&
			room.pricePerNight <= priceRange[1];

		const matchesCapacity =
			capacity === "all" ||
			(room.occupancy && room.occupancy >= Number(capacity));

		return matchesPrice && matchesCapacity;
	});

	if (loading) {
		return <div className="p-10 text-charcoal/60">Loading rooms…</div>;
	}

	/* ---------------- UI ---------------- */

	return (
		<>
			{/* Hero */}
			<section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url('/luxury-hotel-room-collection-hero.jpg')`,
					}}
				>
					<div className="absolute inset-0 bg-charcoal/70" />
				</div>

				<div className="relative z-10 text-center px-6">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-5xl md:text-6xl font-serif font-semibold text-ivory"
					>
						Rooms & Suites
					</motion.h1>
				</div>
			</section>

			{/* Content */}
			<section className="py-16 bg-cream">
				<div className="mx-auto max-w-7xl px-6">
					{/* Header */}
					<div className="flex justify-between mb-10">
						<p className="text-charcoal/60">
							Showing {filteredRooms.length} room
							{filteredRooms.length !== 1 && "s"}
						</p>

						<Button
							variant="outline"
							className="md:hidden"
							onClick={() => setShowFilters(!showFilters)}
						>
							<SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
						</Button>
					</div>

					{/* Rooms Grid */}
					{filteredRooms.length === 0 ? (
						<div className="text-center text-charcoal/60 py-20">
							No rooms available.
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{filteredRooms.map((room, index) => (
								<motion.div
									key={room._id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
								>
									<Link href={`/rooms/${room._id}`}>
										<div className="bg-card rounded-2xl overflow-hidden shadow hover:shadow-lg">
											<img
												src={
													room.images?.listing ||
													room.images?.hero ||
													"/placeholder.svg"
												}
												alt={room.name}
												className="h-64 w-full object-cover"
											/>

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
															{room.size}
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
		</>
	);
}
