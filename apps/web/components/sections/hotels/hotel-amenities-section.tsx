"use client";

import { motion } from "framer-motion";
import {
	BookOpen,
	Car,
	Coffee,
	Dumbbell,
	Flower2,
	Mountain,
	Music,
	Sparkles,
	TreePine,
	UtensilsCrossed,
	Waves,
	Wifi,
} from "lucide-react";
import type React from "react";

const amenityIcons: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	"Rooftop Infinity Pool": Waves,
	"World-Class Spa": Sparkles,
	"Fine Dining Restaurant": UtensilsCrossed,
	"Fitness Center": Dumbbell,
	"Valet Parking": Car,
	"High-Speed WiFi": Wifi,
	"24/7 Concierge": Coffee,
	"Business Center": BookOpen,
	"Ayurvedic Spa": Flower2,
	"Cultural Experiences": Music,
	"Garden Restaurant": TreePine,
	"Tea Lounge": Coffee,
	"Yoga Pavilion": Sparkles,
	Library: BookOpen,
	"Nature Walks": Mountain,
	"Temple Tours": Mountain,
	"Private Beach Access": Waves,
	"Beachfront Pool": Waves,
	"Seafood Restaurant": UtensilsCrossed,
	"Sunset Bar": Coffee,
	"Water Sports": Waves,
	"Surf Lessons": Waves,
	"Fort Walking Tours": Mountain,
	"Whale Watching Trips": Waves,
	"Tea Estate Tours": TreePine,
	"Fireplace Lounges": Sparkles,
	"English Garden": Flower2,
	"High Tea Service": Coffee,
	"Golf Course Access": TreePine,
	"Hiking Trails": Mountain,
	"Bird Watching": TreePine,
	"Strawberry Picking": Flower2,
};

export function HotelAmenitiesSection({ amenities }: { amenities: string[] }) {
	return (
		<section className="py-24 bg-charcoal text-ivory">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
						Hotel Features
					</span>
					<h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-ivory text-balance">
						Amenities & Services
					</h2>
				</motion.div>

				{/* Amenities Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{amenities.map((amenity, index) => {
						const Icon = amenityIcons[amenity] || Sparkles;
						return (
							<motion.div
								key={amenity}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.05 }}
								className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
							>
								<div className="w-14 h-14 mx-auto rounded-xl bg-gold/20 flex items-center justify-center mb-4">
									<Icon className="w-7 h-7 text-gold" />
								</div>
								<h3 className="font-medium text-ivory">{amenity}</h3>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
