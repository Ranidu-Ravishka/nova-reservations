"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
	{ name: "Home", href: "/" },
	{
		name: "Our Hotels",
		href: "/hotels",
		submenu: [
			{ name: "Colombo", href: "/hotels/colombo" },
			{ name: "Kandy", href: "/hotels/kandy" },
			{ name: "Galle", href: "/hotels/galle" },
			{ name: "Nuwara Eliya", href: "/hotels/nuwara-eliya" },
		],
	},
	{ name: "Rooms", href: "/rooms" },
	{ name: "Transport", href: "/transport" },
	{ name: "Offers", href: "/offers" },
	{ name: "Contact", href: "/contact" },
];

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
					isScrolled
						? "bg-charcoal/95 backdrop-blur-xl shadow-lg"
						: "bg-transparent"
				}`}
			>
				<nav className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="flex h-20 items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-3">
							<div className="flex flex-col">
								<span
									className={`text-xl font-serif font-semibold tracking-wide ${
										isScrolled ? "text-ivory" : "text-ivory"
									}`}
								>
									NOVA
								</span>
								<span
									className={`text-[10px] tracking-[0.3em] uppercase ${isScrolled ? "text-gold" : "text-gold"}`}
								>
									Reservations Group
								</span>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-1">
							{navigation.map((item) => (
								<div
									role="menu"
									tabIndex={0}
									key={item.name}
									className="relative"
									onMouseEnter={() =>
										item.submenu && setActiveSubmenu(item.name)
									}
									onMouseLeave={() => setActiveSubmenu(null)}
								>
									<Link
										href={item.href}
										className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
											isScrolled
												? "text-ivory/80 hover:text-gold"
												: "text-ivory/90 hover:text-gold"
										}`}
									>
										{item.name}
										{item.submenu && <ChevronDown className="w-3 h-3" />}
									</Link>

									{/* Submenu */}
									<AnimatePresence>
										{item.submenu && activeSubmenu === item.name && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												className="absolute top-full left-0 mt-2 w-48 glass-dark rounded-xl overflow-hidden"
											>
												{item.submenu.map((subItem) => (
													<Link
														key={subItem.name}
														href={subItem.href}
														className="block px-4 py-3 text-sm text-ivory/80 hover:text-gold hover:bg-white/5 transition-colors"
													>
														{subItem.name}
													</Link>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							))}
						</div>

						{/* CTA Button */}
						<div className="hidden lg:flex items-center gap-4">
							<Link href="/login">
								<Button
									variant="ghost"
									className={`${isScrolled ? "text-ivory hover:text-gold" : "text-ivory hover:text-gold"}`}
								>
									Login
								</Button>
							</Link>
							<Link href="/booking">
								<Button className="bg-gold text-charcoal hover:bg-gold-light font-medium px-6 rounded-full">
									Book Now
								</Button>
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							type="button"
							className="lg:hidden text-ivory"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</nav>
			</motion.header>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "100%" }}
						transition={{ type: "tween", duration: 0.3 }}
						className="fixed inset-0 z-40 bg-charcoal lg:hidden"
					>
						<div className="flex flex-col h-full pt-24 px-6">
							{navigation.map((item, index) => (
								<motion.div
									key={item.name}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<Link
										href={item.href}
										className="block py-4 text-2xl font-serif text-ivory hover:text-gold transition-colors border-b border-white/10"
										onClick={() => setIsMobileMenuOpen(false)}
									>
										{item.name}
									</Link>
								</motion.div>
							))}
							<div className="mt-8 space-y-4">
								<Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
									<Button
										variant="outline"
										className="w-full border-gold text-gold hover:bg-gold hover:text-charcoal rounded-full bg-transparent"
									>
										Login
									</Button>
								</Link>
								<Link
									href="/booking"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<Button className="w-full bg-gold text-charcoal hover:bg-gold-light rounded-full">
										Book Now
									</Button>
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
