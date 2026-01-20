"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HotelHeroProps {
	hotel: {
		id: string;
		name: string;
		description?: string;
		location: string;
		images: string[];
	};
}

export function HotelHeroSection({ hotel }: HotelHeroProps) {
	const heroImage = hotel.images?.[0] || "/placeholder.svg";

	return (
		<section className="relative h-[80vh] min-h-[600px] flex items-end overflow-hidden">
			{/* Background */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${heroImage})` }}
			>
				<div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20" />
			</div>

			{/* Content */}
			<div className="relative z-10 w-full pb-16">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<div className="flex items-center gap-2 text-gold text-sm mb-4">
							<MapPin className="w-4 h-4" />
							{hotel.location}
						</div>

						<h1 className="text-6xl font-serif font-semibold text-ivory mb-6">
							{hotel.name}
						</h1>

						{hotel.description && (
							<p className="text-xl text-ivory/80 max-w-2xl mb-8">
								{hotel.description}
							</p>
						)}

						<Link href={`/rooms?hotel=${hotel.id}`}>
							<Button className="bg-gold text-charcoal rounded-full px-8 py-6">
								View Rooms
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
