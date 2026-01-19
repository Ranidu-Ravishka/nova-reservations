"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Hotel {
	id: string;
	name: string;
	tagline: string;
	description: string;
	heroImage: string;
	address: string;
	phone: string;
	email: string;
}

export function HotelHeroSection({ hotel }: { hotel: Hotel }) {
	return (
		<section className="relative h-[80vh] min-h-[600px] flex items-end overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage: `url('${hotel.heroImage}')`,
				}}
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
							<span className="tracking-wider uppercase">{hotel.tagline}</span>
						</div>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-ivory mb-6">
							{hotel.name}
						</h1>

						<p className="text-xl text-ivory/80 max-w-2xl mb-8">
							{hotel.description}
						</p>

						{/* Contact Info */}
						<div className="flex flex-wrap gap-6 mb-8 text-ivory/70 text-sm">
							<div className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-gold" />
								<span>{hotel.address}</span>
							</div>
							<a
								href={`tel:${hotel.phone}`}
								className="flex items-center gap-2 hover:text-gold transition-colors"
							>
								<Phone className="w-4 h-4 text-gold" />
								<span>{hotel.phone}</span>
							</a>
							<a
								href={`mailto:${hotel.email}`}
								className="flex items-center gap-2 hover:text-gold transition-colors"
							>
								<Mail className="w-4 h-4 text-gold" />
								<span>{hotel.email}</span>
							</a>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-wrap gap-4">
							<Link href={`/booking?hotel=${hotel.id}`}>
								<Button className="bg-gold text-charcoal hover:bg-gold-light font-medium px-8 py-6 text-base rounded-full">
									Book Your Stay
								</Button>
							</Link>
							<Link href={`/rooms?hotel=${hotel.id}`}>
								<Button
									variant="outline"
									className="border-ivory/30 text-ivory hover:bg-ivory/10 font-medium px-8 py-6 text-base rounded-full bg-transparent"
								>
									View All Rooms
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
