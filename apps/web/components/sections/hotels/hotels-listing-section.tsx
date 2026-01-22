"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Hotel {
	_id: string;
	name: string;
	location: string;
	description: string;
	amenities: string[];
	images: string[]; // ✅ SIMPLE ARRAY
}

export function HotelsListingSection() {
	const [hotels, setHotels] = useState<Hotel[]>([]);

	useEffect(() => {
		fetch("http://localhost:4000/api/hotels")
			.then((res) => res.json())
			.then(setHotels);
	}, []);

	return (
		<section className="py-24 bg-cream">
			<div className="mx-auto max-w-7xl px-6 space-y-16">
				{hotels.map((hotel, index) => {
					const cardImage =
						hotel.images?.[1] || hotel.images?.[0] || "/placeholder.svg";

					return (
						<motion.div
							key={hotel._id}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
						>
							<Link href={`/hotels/${hotel._id}`} className="group block">
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
									{/* Image */}
									<div className="overflow-hidden rounded-2xl">
										<Image
											src={cardImage}
											alt={hotel.name}
											width={1200}
											height={800}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
										/>
									</div>

									{/* Content */}
									<div>
										<div className="flex items-center gap-2 text-gold text-sm mb-3">
											<MapPin className="w-4 h-4" />
											<span className="uppercase tracking-wider">
												{hotel.location}
											</span>
										</div>

										<h2 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">
											{hotel.name}
										</h2>

										<p className="text-charcoal/70 text-lg mb-6">
											{hotel.description}
										</p>

										<div className="flex items-center gap-2 text-gold font-medium">
											<span>Explore {hotel.name}</span>
											<ArrowRight className="w-5 h-5" />
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
