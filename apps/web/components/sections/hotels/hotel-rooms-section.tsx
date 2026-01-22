"use client";

import { motion } from "framer-motion";
import { ArrowRight, Maximize, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* -------------------------
   TYPES (match API)
-------------------------- */
export interface RoomType {
	_id: string;
	name: string;
	description: string;
	pricePerNight: number;
	size?: string;
	occupancy?: number;
	images?: string[];
}

interface HotelRoomsSectionProps {
	hotelId: string;
	hotelName: string;
	rooms: RoomType[];
}

/* -------------------------
   COMPONENT
-------------------------- */
export function HotelRoomsSection({
	hotelId,
	hotelName,
	rooms,
}: HotelRoomsSectionProps) {
	if (!rooms.length) {
		return null;
	}

	return (
		<section className="py-24 bg-background">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Header */}
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
						<h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal">
							Rooms & Suites
						</h2>
						<p className="mt-4 text-lg text-charcoal/60">
							Choose from our selection of rooms at {hotelName}
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
					{rooms.map((room, index) => (
						<motion.div
							key={room._id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="group"
						>
							<Link href={`/rooms/${room._id}`}>
								<div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
									{/* Image */}
									<div className="relative aspect-[4/3] overflow-hidden">
										<Image
											src={room.images?.[0] || "/placeholder.svg"}
											alt={room.name}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
									</div>

									{/* Content */}
									<div className="p-6">
										<h3 className="text-xl font-serif font-semibold text-charcoal mb-2">
											{room.name}
										</h3>

										<p className="text-charcoal/60 text-sm mb-4 line-clamp-2">
											{room.description}
										</p>

										{/* Meta */}
										<div className="flex items-center gap-4 text-sm text-charcoal/50 mb-4">
											{room.occupancy && (
												<div className="flex items-center gap-1">
													<Users className="w-4 h-4" />
													<span>{room.occupancy} Guests</span>
												</div>
											)}
											{room.size && (
												<div className="flex items-center gap-1">
													<Maximize className="w-4 h-4" />
													<span>{room.size}</span>
												</div>
											)}
										</div>

										{/* Price */}
										<div className="flex items-center justify-between">
											<span className="text-2xl font-serif font-semibold text-charcoal">
												${room.pricePerNight}
												<span className="text-sm text-charcoal/50">
													{" "}
													/ night
												</span>
											</span>

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
