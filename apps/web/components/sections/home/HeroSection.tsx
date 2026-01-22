"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	const prefersReducedMotion = useReducedMotion();

	const fadeUp = {
		hidden: { opacity: 0, y: 30 },
		visible: { opacity: 1, y: 0 },
	};

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const baseDuration = prefersReducedMotion ? 0 : 0.8;

	return (
		<section
			aria-labelledby="hero-title"
			className="relative h-screen min-h-175 flex items-center justify-center overflow-hidden"
		>
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
				}}
			>
				<div className="absolute inset-0 bg-linear-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
			</div>

			<div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					transition={{ duration: baseDuration, delay: 0.2 }}
					className="mb-6"
				>
					<span className="text-rose-300 text-sm tracking-[0.3em] uppercase font-medium">
						Welcome to
					</span>
				</motion.div>

				<motion.h1
					id="hero-title"
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					transition={{ duration: baseDuration, delay: 0.4 }}
					className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold text-rose-300 mb-6 text-balance"
				>
					Nova Reservations
					<span className="block text-rose-300">Group</span>
				</motion.h1>

				<motion.p
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					transition={{ duration: baseDuration, delay: 0.6 }}
					className="text-xl md:text-2xl text-rose-300 font-light max-w-2xl mx-auto mb-10 text-pretty"
				>
					Experience unparalleled luxury across four stunning destinations in
					Sri Lanka
				</motion.p>

				<motion.div
					variants={fadeUp}
					initial="hidden"
					animate="visible"
					transition={{ duration: baseDuration, delay: 0.8 }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
				>
					<Link href="/hotels">
						<Button
							size="lg"
							className="bg-rose-300 text-charcoal hover:bg-rose-200 font-medium px-8 py-6 text-base rounded-full"
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
				variants={fadeIn}
				initial="hidden"
				animate="visible"
				transition={{ delay: 1.2, duration: baseDuration }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
			>
				<motion.div
					aria-hidden="true"
					animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
					transition={
						prefersReducedMotion ? undefined : { repeat: Infinity, duration: 2 }
					}
					className="flex flex-col items-center gap-2 text-ivory/60"
				>
					<span className="text-xs tracking-widest uppercase">Scroll</span>
					<ChevronDown className="w-5 h-5" />
				</motion.div>
			</motion.div>
		</section>
	);
}
