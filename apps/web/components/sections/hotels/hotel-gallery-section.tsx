"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HotelGallerySectionProps {
	images: string[];
	hotelName: string;
}

export function HotelGallerySection({
	images,
	hotelName,
}: HotelGallerySectionProps) {
	const [selectedImage, setSelectedImage] = useState<number | null>(null);

	const openLightbox = (index: number) => setSelectedImage(index);
	const closeLightbox = () => setSelectedImage(null);

	const nextImage = () => {
		if (selectedImage !== null) {
			setSelectedImage((selectedImage + 1) % images.length);
		}
	};

	const prevImage = () => {
		if (selectedImage !== null) {
			setSelectedImage((selectedImage - 1 + images.length) % images.length);
		}
	};

	return (
		<>
			<section className="py-24 bg-cream">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					{/* Section Header */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12"
					>
						<span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
							Visual Journey
						</span>
						<h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
							Gallery
						</h2>
					</motion.div>

					{/* Gallery Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{images.map((image, index) => (
							<motion.div
								key={image}
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
									index === 0 ? "col-span-2 row-span-2" : ""
								}`}
								onClick={() => openLightbox(index)}
							>
								<div
									className={`relative ${index === 0 ? "aspect-square" : "aspect-4/3"}`}
								>
									<Image
										src={image || "/placeholder.svg"}
										alt={`${hotelName} - Gallery item ${index + 1}`}
										fill
										sizes={
											index === 0
												? "(min-width: 768px) 50vw, 100vw"
												: "(min-width: 768px) 25vw, 50vw"
										}
										className="object-cover transition-transform duration-700 group-hover:scale-110"
										unoptimized
									/>
								</div>
								<div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors flex items-center justify-center">
									<span className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity font-medium">
										View
									</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Lightbox */}
			<AnimatePresence>
				{selectedImage !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center"
						onClick={closeLightbox}
					>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-4 right-4 text-ivory hover:text-gold z-10"
							onClick={closeLightbox}
						>
							<X className="w-6 h-6" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory hover:text-gold z-10"
							onClick={(e) => {
								e.stopPropagation();
								prevImage();
							}}
						>
							<ChevronLeft className="w-8 h-8" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory hover:text-gold z-10"
							onClick={(e) => {
								e.stopPropagation();
								nextImage();
							}}
						>
							<ChevronRight className="w-8 h-8" />
						</Button>

						<motion.div
							key={selectedImage}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="relative w-[90vw] h-[90vh]"
							onClick={(e) => e.stopPropagation()}
						>
							<Image
								src={images[selectedImage] || "/placeholder.svg"}
								alt={`${hotelName} - Gallery item ${selectedImage + 1}`}
								fill
								sizes="90vw"
								className="object-contain rounded-lg"
								priority
								unoptimized
							/>
						</motion.div>

						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-ivory/60 text-sm">
							{selectedImage + 1} / {images.length}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
