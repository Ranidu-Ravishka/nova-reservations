"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `url('/luxury-hotel-lobby-with-elegant-interior-design-go.jpg')`,
				}}
			>
				<div className="absolute inset-0 bg-linear-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
			</div>

			<div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="mb-6"
				>
					<span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
						Welcome to
					</span>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold text-ivory mb-6 text-balance"
				>
					Nova Reservations
					<span className="block text-gold">Group</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="text-xl md:text-2xl text-ivory/80 font-light max-w-2xl mx-auto mb-10 text-pretty"
				>
					Experience unparalleled luxury across four stunning destinations in
					Sri Lanka
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<Link href="/hotels">
						<Button
							size="lg"
							className="bg-gold text-charcoal hover:bg-gold-light font-medium px-8 py-6 text-base rounded-full"
						>
							Explore Our Hotels
						</Button>
					</Link>

					<Link href="/booking">
						<Button
							size="lg"
							variant="outline"
							className="border-ivory/30 text-ivory hover:bg-ivory/10 font-medium px-8 py-6 text-base rounded-full bg-transparent"
						>
							Book Your Stay
						</Button>
					</Link>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2, duration: 0.8 }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ repeat: Infinity, duration: 2 }}
					className="flex flex-col items-center gap-2 text-ivory/60"
				>
					<span className="text-xs tracking-widest uppercase">Scroll</span>
					<ChevronDown className="w-5 h-5" />
				</motion.div>
			</motion.div>
		</section>
	);
}
