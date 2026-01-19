"use client";

import { motion } from "framer-motion";
import { Car, Clock, MapPin, Sparkles, Utensils, Wifi } from "lucide-react";

interface Hotel {
	id: string;
	name: string;
	longDescription: string;
	coordinates: { lat: number; lng: number };
}

const highlights = [
	{ icon: Clock, label: "24/7 Service" },
	{ icon: Utensils, label: "Fine Dining" },
	{ icon: Wifi, label: "High-Speed WiFi" },
	{ icon: Car, label: "Valet Parking" },
	{ icon: Sparkles, label: "Daily Housekeeping" },
	{ icon: MapPin, label: "Prime Location" },
];

export function HotelOverviewSection({ hotel }: { hotel: Hotel }) {
	return (
		<section className="py-24 bg-cream">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
					{/* Content */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
							About the Hotel
						</span>
						<h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
							Welcome to {hotel.name}
						</h2>
						<p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
							{hotel.longDescription}
						</p>

						{/* Highlights Grid */}
						<div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
							{highlights.map((item, index) => (
								<motion.div
									key={item.label}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: index * 0.1 }}
									className="flex items-center gap-3"
								>
									<div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
										<item.icon className="w-5 h-5 text-gold" />
									</div>
									<span className="text-sm text-charcoal/70">{item.label}</span>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Map Placeholder */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
					>
						<div className="aspect-square rounded-2xl overflow-hidden bg-muted">
							<iframe
								src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128636!2d${hotel.coordinates.lng}!3d${hotel.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMzcuNiJOIDc5wrA1MSc0MC4zIkU!5e0!3m2!1sen!2slk!4v1234567890`}
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title={`${hotel.name} Location`}
								className="grayscale contrast-125"
							/>
						</div>
						{/* Location Card */}
						<div className="absolute bottom-4 left-4 right-4 glass-dark rounded-xl p-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
									<MapPin className="w-5 h-5 text-charcoal" />
								</div>
								<div>
									<h4 className="font-medium text-ivory">{hotel.name}</h4>
									<p className="text-sm text-ivory/60">View on Google Maps</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
