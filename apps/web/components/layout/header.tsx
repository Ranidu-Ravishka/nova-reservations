"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { ChevronDown, Menu, X, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Hotel } from "@/types/hotel";
import { useRouter } from "next/navigation";
import { AvailabilitySearch } from "@/components/navbar/AvailabilitySearch";
import { API_BASE_URL } from "@/lib/config";

/* ---------------- TYPES ---------------- */

type UserType = {
  name: string;
  email: string;
  role: string;
};

/* ---------------- COMPONENT ---------------- */

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
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [user, setUser] = useState<UserType | null>(null);

  /* ---------------- SCROLL EFFECT ---------------- */

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------- LOAD USER ---------------- */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------------- LOAD HOTELS (FIXED) ---------------- */

  useEffect(() => {
  fetch("http://localhost:4000/api/hotels")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch hotels");
      return res.json();
    })
    .then((data) => setHotels(data))
    .catch(console.error);
}, []);

  /* ---------------- LOGOUT ---------------- */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

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
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        isScrolled ? "bg-charcoal/95 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="text-ivory font-serif text-xl">
            NOVA
          </Link>

					{/* Desktop Nav */}
					<div className="hidden lg:flex items-center gap-4">
						<Link href="/" className="nav-link">
							Home
						</Link>
          {/* CENTER NAV */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            <Link href="/" className="nav-link">Home</Link>

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
            {/* HOTELS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setActiveSubmenu("hotels")}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <button className="nav-link flex items-center gap-1">
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
            <Link href="/rooms" className="nav-link">Rooms</Link>
            <Link href="/contact" className="nav-link">Contact</Link>

            {/* AVAILABILITY SEARCH */}
            <AvailabilitySearch hotels={hotels} />
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full border-white text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gold text-charcoal rounded-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-ivory text-sm">
                  <User className="w-4 h-4" />
                  {user.name}
                </div>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="rounded-full border-white text-white hover:bg-red-500"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
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
          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden text-ivory"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
