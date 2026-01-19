"use client";

import { motion } from "framer-motion";
import { ArrowRight, Maximize, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RoomType {
	id: string;
	name: string;
	image?: string;
	description: string;
	maxGuests: number;
	size: string;
	basePrice: number;
}

interface HotelRoomsSectionProps {
	hotelId: string;
	hotelName: string;
}

export function HotelRoomsSection({
	hotelId,
	hotelName,
}: HotelRoomsSectionProps) {
	const roomTypes: RoomType[] = [
		{
			id: "1",
			name: "Standard Room",
			image: "/rooms/standard.jpg",
			description: "Comfortable room with essential amenities",
			maxGuests: 2,
			size: "250 sqft",
			basePrice: 150,
		},
		{
			id: "2",
			name: "Deluxe Room",
			image: "/rooms/deluxe.jpg",
			description: "Spacious room with premium furnishings",
			maxGuests: 2,
			size: "350 sqft",
			basePrice: 200,
		},
		{
			id: "3",
			name: "Suite",
			image: "/rooms/suite.jpg",
			description: "Luxury suite with separate living area",
			maxGuests: 4,
			size: "500 sqft",
			basePrice: 300,
		},
		{
			id: "4",
			name: "Penthouse",
			image: "/rooms/penthouse.jpg",
			description: "Ultimate luxury experience with panoramic views",
			maxGuests: 6,
			size: "800 sqft",
			basePrice: 500,
		},
	];

	return (
		<section className="py-24 bg-background">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
				>
					<div>
						<span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
							Accommodations
						</span>
						<h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
							Rooms & Suites
						</h2>
						<p className="mt-4 text-lg text-charcoal/60">
							Choose from our selection of elegantly appointed rooms at{" "}
							{hotelName}
						</p>
					</div>
					<Link href={`/rooms?hotel=${hotelId}`}>
						<Button
							variant="outline"
							className="border-charcoal/20 text-charcoal hover:border-gold hover:text-gold rounded-full bg-transparent"
						>
							View All Rooms
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</Link>
				</motion.div>

				{/* Rooms Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{roomTypes.map((room: RoomType, index) => (
						<motion.div
							key={room.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="group"
						>
							<Link href={`/rooms/${room.id}?hotel=${hotelId}`}>
								<div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
									<div className="relative aspect-[4/3] overflow-hidden">
										<img
											src={room.image || "/placeholder.svg"}
											alt={room.name}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
									</div>
									<div className="p-6">
										<h3 className="text-xl font-serif font-semibold text-charcoal mb-2">
											{room.name}
										</h3>
										<p className="text-charcoal/60 text-sm mb-4 line-clamp-2">
											{room.description}
										</p>

										{/* Room Details */}
										<div className="flex items-center gap-4 text-sm text-charcoal/50 mb-4">
											<div className="flex items-center gap-1">
												<Users className="w-4 h-4" />
												<span>{room.maxGuests} Guests</span>
											</div>
											<div className="flex items-center gap-1">
												<Maximize className="w-4 h-4" />
												<span>{room.size}</span>
											</div>
										</div>

										{/* Price */}
										<div className="flex items-center justify-between">
											<div>
												<span className="text-2xl font-serif font-semibold text-charcoal">
													${room.basePrice}
												</span>
												<span className="text-sm text-charcoal/50">
													{" "}
													/ night
												</span>
											</div>
											<span className="text-gold text-sm font-medium group-hover:underline">
												View Details
											</span>
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
