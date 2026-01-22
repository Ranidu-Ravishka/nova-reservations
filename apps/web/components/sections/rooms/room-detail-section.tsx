"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { ImageSet } from "@/types/images";

interface Room {
	_id: string;
	name: string;
	description: string;
	pricePerNight: number;
	amenities: string[];
	images: ImageSet;
}

export function RoomDetailSection({ room }: { room: Room }) {
	return (
		<>
			{/* HERO IMAGE */}
			{room.images?.hero && (
				<section
					className="h-[60vh] bg-cover bg-center"
					style={{ backgroundImage: `url(${room.images.hero})` }}
				/>
			)}

			<section className="py-20 bg-cream">
				<div className="mx-auto max-w-6xl px-6">
					<h1 className="text-4xl font-serif font-semibold">{room.name}</h1>
					<p className="mt-4 text-charcoal/70">{room.description}</p>

					<p className="mt-6 text-2xl font-medium text-gold">
						${room.pricePerNight} / night
					</p>

					<Button className="mt-8">Book Now</Button>

					{/* GALLERY */}
					{room.images?.gallery?.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
							{room.images.gallery.map((img, i) => (
								<motion.div
									key={img}
									className="relative w-full h-[320px]"
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
								>
									<Image
										src={img}
										alt={`${room.name} ${i + 1}`}
										fill
										sizes="(min-width: 768px) 50vw, 100vw"
										className="rounded-xl object-cover"
									/>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
