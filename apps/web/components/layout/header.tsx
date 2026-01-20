"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/hotel";

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
	const [hotels, setHotels] = useState<Hotel[]>([]);

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
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 inset-x-0 z-50 transition-all ${
					isScrolled ? "bg-charcoal/95 backdrop-blur-xl" : "bg-transparent"
				}`}
			>
				<nav className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="flex h-20 items-center justify-between">
						{/* Logo */}
						<Link href="/" className="text-ivory font-serif text-xl">
							NOVA
						</Link>

						{/* Desktop Nav */}
						<div className="hidden lg:flex items-center gap-4">
							<Link href="/" className="nav-link">
								Home
							</Link>

							{/* Hotels Dropdown */}
							<div
								onMouseEnter={() => setActiveSubmenu("hotels")}
								onMouseLeave={() => setActiveSubmenu(null)}
								className="relative"
							>
								<Link
									href="/hotels"
									className="nav-link flex items-center gap-1"
								>
									Our Hotels <ChevronDown className="w-4 h-4" />
								</Link>

								<AnimatePresence>
									{activeSubmenu === "hotels" && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: 10 }}
											className="absolute top-full mt-2 w-56 glass-dark rounded-xl"
										>
											{hotels.map((hotel) => (
												<Link
													key={hotel._id}
													href={`/hotels/${hotel._id}`}
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
							className="lg:hidden text-ivory"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X /> : <Menu />}
						</button>
					</div>
				</nav>
			</motion.header>
		</>
	);
}
