"use client";

import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Hotel } from "@/types/hotel";

/* ---------------- TYPES ---------------- */

type UserType = {
	name: string;
	email: string;
	role: string;
};

type NavLink = {
	href: string;
	label: string;
};

const NAV_LINKS: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/rooms", label: "Rooms" },
	{ href: "/transport", label: "Transport" },
	{ href: "/contact", label: "Contact" },
];

const LOADING_SKELETON_KEYS = [
	"hotel-loading-1",
	"hotel-loading-2",
	"hotel-loading-3",
	"hotel-loading-4",
];

/* ---------------- COMPONENT ---------------- */

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [hotelsLoading, setHotelsLoading] = useState(true);
	const [user, setUser] = useState<UserType | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	const hotelsPreview = useMemo(() => hotels.slice(0, 6), [hotels]);
	const userInitial = useMemo(() => {
		const initial = user?.name?.trim()?.[0];
		return initial ? initial.toUpperCase() : "U";
	}, [user]);

	/* ---------------- SCROLL EFFECT ---------------- */

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 50);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	/* ---------------- LOAD USER ---------------- */

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (!storedUser) return;
		try {
			const parsed = JSON.parse(storedUser) as Partial<UserType> | null;
			if (parsed?.name && parsed?.email && parsed?.role) {
				setUser(parsed as UserType);
			} else {
				localStorage.removeItem("user");
			}
		} catch {
			localStorage.removeItem("user");
		}
	}, []);

	/* ---------------- LOAD HOTELS ---------------- */

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const res = await fetch("/api/hotels", { cache: "no-store" });
				if (!res.ok) return;
				const data = (await res.json()) as Hotel[];
				if (!cancelled) setHotels(data);
			} catch (err) {
				// Keep header usable even if API is down.
				console.error(err);
			} finally {
				if (!cancelled) setHotelsLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	/* ---------------- LOGOUT ---------------- */

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		router.push("/login");
	};

	const linkBase =
		"text-sm font-medium text-ivory/80 transition-colors hover:text-ivory";
	const linkActive = "text-ivory";

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname.startsWith(href);
	};

	const navLinkClass = (href: string) =>
		`${linkBase} ${isActive(href) ? linkActive : ""}`.trim();

	return (
		<header
			className={
				"fixed inset-x-0 top-0 z-50 transition-all duration-300 " +
				(isScrolled
					? "bg-charcoal/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
					: "bg-transparent shadow-none")
			}
		>
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="flex h-20 items-center justify-between gap-4">
					{/* Brand */}
					<Link
						href="/"
						aria-label="NOVA Home"
						className="flex items-center gap-3"
					>
						<Image
							src={
								"https://drive.google.com/uc?export=view&id=157D1c8TFTpM1ivRzzrCvkvAiFVpxdiIb"
							}
							alt="NOVA logo"
							width={132}
							height={36}
							priority
							className="h-9 w-auto"
						/>
					</Link>

					{/* Desktop nav */}
					<nav
						className="hidden lg:flex flex-1 items-center justify-center gap-8"
						aria-label="Primary"
					>
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={navLinkClass(link.href)}
								aria-current={isActive(link.href) ? "page" : undefined}
							>
								{link.label}
							</Link>
						))}
						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									className={`${linkBase} inline-flex items-center gap-1`}
									aria-label="Open hotels menu"
								>
									Hotels
									<ChevronDown className="h-4 w-4 opacity-70" />
								</button>
							</PopoverTrigger>
							<PopoverContent
								align="center"
								sideOffset={12}
								className="w-80 p-2 glass-dark text-ivory border-white/10 rounded-2xl shadow-2xl"
							>
								<div className="px-3 py-2">
									<p className="text-xs uppercase tracking-[0.2em] text-ivory/50">
										Explore hotels
									</p>
								</div>
								<div className="px-2 pb-2">
									<Link
										href="/hotels"
										className="block rounded-xl px-3 py-2 text-sm text-ivory/90 hover:bg-white/5"
									>
										View all hotels
									</Link>
									{hotelsLoading ? (
										<div className="mt-2 space-y-2 px-3 pb-2">
											{LOADING_SKELETON_KEYS.map((key) => (
												<div
													key={key}
													className="h-3 rounded-full bg-white/10 animate-pulse"
												/>
											))}
										</div>
									) : hotelsPreview.length > 0 ? (
										hotelsPreview.map((hotel) => (
											<Link
												key={hotel._id}
												href={`/hotels/${hotel._id}`}
												className="block rounded-xl px-3 py-2 text-sm text-ivory/80 hover:bg-white/5 hover:text-gold"
											>
												{hotel.name}
											</Link>
										))
									) : (
										<p className="px-3 py-2 text-xs text-ivory/60">
											No hotels available right now.
										</p>
									)}
								</div>
							</PopoverContent>
						</Popover>
					</nav>

					{/* Desktop actions */}
					<div className="hidden lg:flex items-center gap-3">
						{!user ? (
							<>
								<Button
									asChild
									variant="outline"
									className="rounded-full border-white/30 bg-white/5 text-ivory hover:bg-white/10"
								>
									<Link href="/login">Login</Link>
								</Button>
								<Button
									asChild
									className="rounded-full bg-gold text-charcoal hover:bg-gold/90"
								>
									<Link href="/register">Sign up</Link>
								</Button>
							</>
						) : (
							<div className="flex items-center gap-3">
								<Popover>
									<PopoverTrigger asChild>
										<button
											type="button"
											className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-ivory hover:bg-white/10"
											aria-label="Open user menu"
										>
											<span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-xs font-semibold">
												{userInitial}
											</span>
											<span className="max-w-35 truncate underline-offset-2 hover:underline">
												{user.name}
											</span>
											<ChevronDown className="h-4 w-4 opacity-70" />
										</button>
									</PopoverTrigger>
									<PopoverContent
										align="end"
										sideOffset={10}
										className="w-72 p-2 glass-dark text-ivory border-white/10 rounded-2xl shadow-2xl"
									>
										<div className="px-3 py-2">
											<p className="text-sm font-medium">{user.name}</p>
											<p className="text-xs text-ivory/60 truncate">
												{user.email}
											</p>
											<p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ivory/50">
												{user.role}
											</p>
										</div>
										<div className="px-2 pb-2">
											<Link
												href="/profile/reservations"
												className="block rounded-xl px-3 py-2 text-sm text-ivory/90 hover:bg-white/5"
											>
												My reservations
											</Link>
											<button
												type="button"
												onClick={logout}
												className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ivory/90 hover:bg-white/5"
											>
												<LogOut className="h-4 w-4" />
												Sign out
											</button>
										</div>
									</PopoverContent>
								</Popover>
								<Button
									asChild
									className="rounded-full bg-amber text-charcoal hover:bg-amber/90"
								>
									<Link href="/rooms">Book now</Link>
								</Button>
							</div>
						)}
					</div>

					{/* Mobile */}
					<div className="lg:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="rounded-full border-white/20 bg-white/5 text-ivory hover:bg-white/10"
									aria-label="Open menu"
								>
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="p-0">
								<div className="p-6">
									<SheetHeader>
										<SheetTitle>Menu</SheetTitle>
									</SheetHeader>

									<div className="mt-6 grid gap-2">
										{NAV_LINKS.map((link) => (
											<SheetClose asChild key={link.href}>
												<Link
													href={link.href}
													className={`rounded-xl px-3 py-3 text-sm font-medium text-ivory hover:bg-white/5 ${
														isActive(link.href) ? "bg-white/10" : ""
													}`}
													aria-current={
														isActive(link.href) ? "page" : undefined
													}
												>
													{link.label}
												</Link>
											</SheetClose>
										))}

										<details className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
											<summary className="flex cursor-pointer list-none items-center justify-between py-1 text-sm font-medium text-ivory">
												Our Hotels
												<ChevronDown className="h-4 w-4 opacity-70" />
											</summary>
											<div className="mt-2 grid gap-1 pb-2">
												<SheetClose asChild>
													<Link
														href="/hotels"
														className="rounded-lg px-2 py-2 text-sm text-ivory/90 hover:bg-white/5 hover:text-gold"
													>
														All hotels
													</Link>
												</SheetClose>
												{hotelsLoading ? (
													<div className="space-y-2 px-2 pb-2">
														{LOADING_SKELETON_KEYS.map((key) => (
															<div
																key={key}
																className="h-3 rounded-full bg-white/10 animate-pulse"
															/>
														))}
													</div>
												) : hotelsPreview.length > 0 ? (
													hotelsPreview.map((hotel) => (
														<SheetClose asChild key={hotel._id}>
															<Link
																href={`/hotels/${hotel._id}`}
																className="rounded-lg px-2 py-2 text-sm text-ivory/80 hover:bg-white/5 hover:text-gold"
															>
																{hotel.name}
															</Link>
														</SheetClose>
													))
												) : (
													<p className="px-2 py-2 text-xs text-ivory/60">
														No hotels available right now.
													</p>
												)}
											</div>
										</details>
									</div>

									<div className="mt-6 grid gap-3 border-t border-white/10 pt-6">
										{!user ? (
											<div className="grid grid-cols-2 gap-3">
												<Button
													asChild
													variant="outline"
													className="rounded-full border-white/20 bg-white/5 text-ivory hover:bg-white/10"
												>
													<SheetClose asChild>
														<Link href="/login">Login</Link>
													</SheetClose>
												</Button>
												<Button
													asChild
													className="rounded-full bg-gold text-charcoal hover:bg-gold/90"
												>
													<SheetClose asChild>
														<Link href="/register">Sign up</Link>
													</SheetClose>
												</Button>
											</div>
										) : (
											<div className="grid gap-2">
												<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
													<div className="flex items-center gap-3">
														<span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-sm font-semibold">
															{userInitial}
														</span>
														<div className="min-w-0">
															<p className="truncate text-sm font-medium text-ivory">
																{user.name}
															</p>
															<p className="truncate text-xs text-ivory/60">
																{user.email}
															</p>
														</div>
													</div>
												</div>

												<Button
													asChild
													className="rounded-full bg-amber text-charcoal hover:bg-amber/90"
												>
													<SheetClose asChild>
														<Link href="/booking">Book now</Link>
													</SheetClose>
												</Button>

												<Button
													variant="outline"
													className="rounded-full border-white/20 bg-white/5 text-ivory hover:bg-white/10"
													onClick={logout}
												>
													<User className="h-4 w-4" />
													Sign out
												</Button>
											</div>
										)}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}
