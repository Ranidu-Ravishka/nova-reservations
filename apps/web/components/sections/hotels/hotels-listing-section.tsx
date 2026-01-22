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
	images?: {
		hero?: string;
		listing?: string;
	};
}

export function HotelsListingSection() {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("http://localhost:4000/api/hotels")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch hotels");
				return res.json();
			})
			.then(setHotels)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="py-20 text-center text-charcoal/60">Loading hotels…</div>
		);
	}

	return (
		<section className="py-24 bg-cream">
			<div className="max-w-7xl mx-auto px-6 space-y-16">
				{hotels.map((hotel, index) => (
					<motion.article
						key={hotel._id}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						viewport={{ once: true }}
					>
						<Link href={`/hotels/${hotel._id}`} className="block group">
							<div className="relative rounded-2xl overflow-hidden shadow-lg">
								<Image
									src={
										hotel.images?.listing ||
										hotel.images?.hero ||
										"/placeholder.svg"
									}
									alt={hotel.name}
									fill
									unoptimized
									sizes="(max-width: 768px) 100vw, 1024px"
									className="object-cover group-hover:scale-105 transition-transform"
								/>

								<div className="absolute inset-0 bg-black/50" />

								<div className="absolute bottom-0 p-6 text-white space-y-2">
									<div className="flex items-center gap-2 text-gold text-sm">
										<MapPin className="w-4 h-4" />
										{hotel.location}
									</div>

									<h2 className="text-2xl font-serif">{hotel.name}</h2>

									<p className="text-sm text-white/80 line-clamp-2">
										{hotel.description}
									</p>

									<span className="inline-flex items-center gap-2 text-gold mt-2">
										Explore <ArrowRight className="w-4 h-4" />
									</span>
								</div>
							</div>
						</Link>
					</motion.article>
				))}
			</div>
		</section>
	);
}
