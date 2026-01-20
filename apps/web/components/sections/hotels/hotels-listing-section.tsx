"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Hotel } from "@/types/hotel";

export function HotelsListingSection() {
	const [hotels, setHotels] = useState<Hotel[]>([]);

	useEffect(() => {
		fetch("http://localhost:4000/api/hotels")
			.then((res) => res.json())
			.then(setHotels);
	}, []);

	return (
		<section className="py-24 bg-cream">
			<div className="max-w-7xl mx-auto px-6 space-y-16">
				{hotels.map((hotel, index) => (
					<motion.div
						key={hotel._id}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: index * 0.1 }}
					>
						<Link href={`/hotels/${hotel._id}`} className="group block">
							<div className="grid lg:grid-cols-2 gap-8">
								<img
									src={hotel.images?.[0] || "/placeholder.svg"}
									className="rounded-2xl object-cover"
								/>

								<div>
									<div className="flex items-center gap-2 text-gold text-sm">
										<MapPin className="w-4 h-4" />
										{hotel.location}
									</div>

									<h2 className="text-4xl font-serif mt-2">{hotel.name}</h2>

									<p className="mt-4 text-charcoal/70">{hotel.description}</p>

									<div className="mt-6 flex items-center gap-2 text-gold">
										Explore <ArrowRight />
									</div>
								</div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	);
}
