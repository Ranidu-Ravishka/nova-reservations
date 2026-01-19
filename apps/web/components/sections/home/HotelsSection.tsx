"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

interface Hotel {
	id: string;
	name: string;
	tagline: string;
	description: string;
	image: string;
}

const hotels: Hotel[] = [
	/* same data */
];

export default function HotelsSection() {
	return (
		<section className="py-24 bg-muted">
			<div className="max-w-7xl mx-auto px-6">
				<h2 className="text-4xl font-serif text-center mb-16">Our Hotels</h2>

				<div className="grid md:grid-cols-2 gap-8">
					{hotels.map((hotel, i) => (
						<motion.article
							key={hotel.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.15 }}
						>
							<Link href={`/hotels/${hotel.id}`} className="group block">
								<div className="relative rounded-xl overflow-hidden">
									<img
										src={hotel.image}
										alt={hotel.name}
										className="h-full w-full object-cover group-hover:scale-110 transition"
									/>
									<div className="absolute inset-0 bg-black/50" />
									<div className="absolute bottom-0 p-6 text-white">
										<div className="flex items-center gap-2 text-gold">
											<MapPin className="w-4 h-4" />
											{hotel.tagline}
										</div>
										<h3 className="text-2xl font-serif">{hotel.name}</h3>
										<p className="text-sm text-white/70">{hotel.description}</p>
										<span className="inline-flex items-center gap-2 text-gold mt-2">
											Explore <ArrowRight className="w-4 h-4" />
										</span>
									</div>
								</div>
							</Link>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
