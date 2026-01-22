"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/hotel";

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
	const [hotels, setHotels] = useState<Hotel[]>([]);

	const closeTimeoutRef = useRef<number | null>(null);

	const clearCloseTimeout = () => {
		if (closeTimeoutRef.current !== null) {
			window.clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
	};

	const scheduleClose = () => {
		clearCloseTimeout();
		closeTimeoutRef.current = window.setTimeout(() => {
			setActiveSubmenu(null);
		}, 100);
	};

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 50);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		fetch("http://localhost:4000/api/hotels")
			.then((res) => res.json())
			.then(setHotels)
			.catch(console.error);
	}, []);

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className={`fixed top-0 inset-x-0 z-50 transition-all ${
				isScrolled
					? "bg-charcoal/95 backdrop-blur-xl border-b border-white/10"
					: "bg-transparent"
			}`}
		>
			<nav className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="flex h-20 items-center justify-between">
					{/* Logo */}
					<Link
						href="/"
						aria-label="NOVA Home"
						className="flex items-center gap-2"
					>
						<Image
							src={
								"https://drive.google.com/uc?export=view&id=157D1c8TFTpM1ivRzzrCvkvAiFVpxdiIb"
							}
							alt="NOVA logo"
							width={120}
							height={32}
							priority
							className="h-8 w-auto"
						/>
					</Link>

					{/* Desktop Nav */}
					<div className="hidden lg:flex items-center gap-4">
						<Link href="/" className="nav-link">
							Home
						</Link>

						{/* Hotels Dropdown */}
						<div className="relative">
							<button
								type="button"
								className="nav-link flex items-center gap-1"
								aria-haspopup="menu"
								aria-expanded={activeSubmenu === "hotels"}
								onMouseEnter={() => {
									clearCloseTimeout();
									setActiveSubmenu("hotels");
								}}
								onMouseLeave={scheduleClose}
								onFocus={() => {
									clearCloseTimeout();
									setActiveSubmenu("hotels");
								}}
								onBlur={scheduleClose}
								onKeyDown={(e) => {
									if (e.key === "Escape") setActiveSubmenu(null);
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										setActiveSubmenu((prev) =>
											prev === "hotels" ? null : "hotels",
										);
									}
								}}
							>
								Our Hotels <ChevronDown className="w-4 h-4" />
							</button>

							<AnimatePresence>
								{activeSubmenu === "hotels" && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className="absolute top-full mt-2 w-56 glass-dark rounded-xl"
										role="menu"
										onMouseEnter={() => {
											clearCloseTimeout();
											setActiveSubmenu("hotels");
										}}
										onMouseLeave={scheduleClose}
										onFocusCapture={() => {
											clearCloseTimeout();
											setActiveSubmenu("hotels");
										}}
										onBlurCapture={(e) => {
											const next = e.relatedTarget as Node | null;
											if (!next || !e.currentTarget.contains(next))
												scheduleClose();
										}}
									>
										<Link
											href="/hotels"
											role="menuitem"
											className="block px-4 py-3 text-sm text-ivory hover:text-gold hover:bg-white/5"
										>
											All Hotels
										</Link>

										{hotels.map((hotel) => (
											<Link
												key={hotel._id}
												href={`/hotels/${hotel._id}`}
												role="menuitem"
												className="block px-4 py-3 text-sm text-ivory hover:text-gold hover:bg-white/5"
											>
												{hotel.name}
											</Link>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<Link href="/rooms" className="nav-link">
							Rooms
						</Link>
						<Link href="/contact" className="nav-link">
							Contact
						</Link>

						<Link href="/booking">
							<Button className="bg-gold text-charcoal rounded-full">
								Book Now
							</Button>
						</Link>
					</div>

					{/* Mobile Toggle */}
					<button
						type="button"
						className="lg:hidden text-ivory"
						aria-label="Toggle mobile menu"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					>
						{isMobileMenuOpen ? <X /> : <Menu />}
					</button>
				</div>
			</nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						className="lg:hidden mx-auto max-w-7xl px-6 lg:px-8"
					>
						<div className="glass-dark rounded-2xl p-4 mt-2 shadow-lg">
							<div className="grid grid-cols-1 gap-2">
								<Link href="/" className="nav-link">
									Home
								</Link>
								<div className="grid gap-1">
									<span className="text-sm text-ivory/70">Our Hotels</span>
									<Link href="/hotels" className="nav-link">
										All Hotels
									</Link>
									{hotels.slice(0, 6).map((hotel) => (
										<Link
											key={hotel._id}
											href={`/hotels/${hotel._id}`}
											className="text-sm text-ivory hover:text-gold"
										>
											{hotel.name}
										</Link>
									))}
								</div>
								<Link href="/rooms" className="nav-link">
									Rooms
								</Link>
								<Link href="/contact" className="nav-link">
									Contact
								</Link>
								<Link href="/booking" className="mt-2">
									<Button className="w-full bg-gold text-charcoal rounded-full">
										Book Now
									</Button>
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
