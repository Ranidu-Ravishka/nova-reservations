"use client";

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

/* ---------------- TYPES ---------------- */

interface Room {
	_id: string;
	name: string;
	description: string;
	basePrice: number;
	maxGuests: number;
	size: string;
	amenities: string[];
	image?: string;
	hotel: string;
}

/* ---------------- COMPONENT ---------------- */

export function RoomsListingSection() {
	const searchParams = useSearchParams();
	const hotelParam = searchParams.get("hotel");

	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);

	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
	const [capacity, setCapacity] = useState("all");
	const [showFilters, setShowFilters] = useState(false);

	/* ---------------- FETCH ROOMS ---------------- */

	useEffect(() => {
		const url = new URL("http://localhost:4000/api/rooms");

		if (hotelParam) {
			url.searchParams.set("hotel", hotelParam);
		}

		fetch(url.toString())
			.then((res) => res.json())
			.then(setRooms)
			.finally(() => setLoading(false));
	}, [hotelParam]);

	/* ---------------- FILTER LOGIC ---------------- */

	const filteredRooms = rooms.filter((room) => {
		const matchesPrice =
			room.basePrice >= priceRange[0] && room.basePrice <= priceRange[1];

		const matchesCapacity =
			capacity === "all" || room.maxGuests >= Number(capacity);

		return matchesPrice && matchesCapacity;
	});

	/* ---------------- LOADING ---------------- */

	if (loading) {
		return <div className="p-10 text-gray-600">Loading rooms…</div>;
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
					{/* Filters */}
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

					{/* Mobile Filters */}
					{showFilters && (
						<div className="md:hidden bg-card rounded-xl p-6 mb-8">
							<div className="flex justify-between mb-4">
								<h3 className="font-semibold">Filters</h3>
								<Button
									size="icon"
									variant="ghost"
									onClick={() => setShowFilters(false)}
								>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<Select value={capacity} onValueChange={setCapacity}>
								<SelectTrigger>
									<SelectValue placeholder="Guests" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Any</SelectItem>
									<SelectItem value="2">2+</SelectItem>
									<SelectItem value="3">3+</SelectItem>
									<SelectItem value="4">4+</SelectItem>
								</SelectContent>
							</Select>

							<div className="mt-6">
								<Slider
									value={priceRange}
									onValueChange={(v) => setPriceRange(v as [number, number])}
									min={0}
									max={1500}
									step={50}
								/>
							</div>
						</div>
					)}

					{/* Rooms Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{filteredRooms.map((room, index) => (
							<motion.div
								key={room._id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
							>
								<Link
									href={`/rooms/${room._id}${hotelParam ? `?hotel=${hotelParam}` : ""}`}
								>
									<div className="bg-card rounded-2xl overflow-hidden shadow hover:shadow-lg">
										<img
											src={room.image || "/placeholder.svg"}
											alt={room.name}
											className="h-64 w-full object-cover"
										/>

										<div className="p-6">
											<h3 className="text-2xl font-serif">{room.name}</h3>
											<p className="text-charcoal/60 mt-2">
												{room.description}
											</p>

											<div className="flex gap-6 text-sm mt-4 text-charcoal/50">
												<span className="flex gap-2">
													<Users className="w-4 h-4" />
													{room.maxGuests} Guests
												</span>
												<span className="flex gap-2">
													<Maximize className="w-4 h-4" />
													{room.size}
												</span>
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
				</div>
			</section>
		</>
	);
}
