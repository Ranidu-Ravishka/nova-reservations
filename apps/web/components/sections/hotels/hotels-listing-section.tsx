"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* -------------------------
   TYPES (match API)
-------------------------- */
interface Hotel {
	_id: string;
	name: string;
	tagline?: string;
	description: string;
	amenities: string[];
	images: string[];
}

/* -------------------------
   COMPONENT
-------------------------- */
export function HotelsListingSection() {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("http://localhost:4000/api/hotels")
			.then((res) => res.json())
			.then(setHotels)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="py-24 text-center text-lg text-gray-600">
				Loading hotels...
			</div>
		);
	}

	return (
		<>
			{/* Hero Section */}
			<section className="relative h-[60vh] min-h-100 flex items-center justify-center overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url('/hotels-hero-sri-lanka-collage.jpg')`,
					}}
				>
					<div className="absolute inset-0 bg-charcoal/70" />
				</div>

				<div className="relative z-10 text-center px-6">
					<motion.span
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-gold text-sm tracking-[0.3em] uppercase font-medium"
					>
						Our Collection
					</motion.span>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-4 text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-ivory"
					>
						Our Hotels
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-6 text-xl text-ivory/80 max-w-2xl mx-auto"
					>
						Four extraordinary destinations across Sri Lanka
					</motion.p>
				</div>
			</section>

			{/* Hotels List */}
			<section className="py-24 bg-cream">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-16">
					{hotels.map((hotel, index) => (
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
										<div className="aspect-4/3">
											<img
												src={hotel.images?.[0] || "/placeholder.svg"}
												alt={hotel.name}
												className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
											/>
										</div>
									</div>

									{/* Content */}
									<div>
										<div className="flex items-center gap-2 text-gold text-sm mb-3">
											<MapPin className="w-4 h-4" />
											<span className="uppercase tracking-wider">
												{hotel.tagline || "Luxury Destination"}
											</span>
										</div>

										<h2 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">
											{hotel.name}
										</h2>

										<p className="text-charcoal/70 text-lg mb-6">
											{hotel.description}
										</p>

										<div className="flex flex-wrap gap-2 mb-6">
											{hotel.amenities.slice(0, 4).map((a) => (
												<span
													key={a}
													className="px-3 py-1 bg-charcoal/5 rounded-full text-sm"
												>
													{a}
												</span>
											))}
										</div>

										<div className="flex items-center gap-2 text-gold font-medium">
											<span>Explore {hotel.name}</span>
											<ArrowRight className="w-5 h-5" />
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</section>
		</>
	);
}
