"use client";

import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AvailabilitySearch } from "@/components/navbar/AvailabilitySearch";
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

/* ---------------- COMPONENT ---------------- */

export function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [user, setUser] = useState<UserType | null>(null);
	const router = useRouter();

	const hotelsPreview = useMemo(() => hotels.slice(0, 6), [hotels]);

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

	return (
		<header
			className={
				"fixed inset-x-0 top-0 z-50 transition-all " +
				(isScrolled
					? "bg-charcoal/90 backdrop-blur-xl border-b border-white/10"
					: "bg-transparent")
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
					<div className="hidden lg:flex flex-1 items-center justify-center gap-8">
						<Link href="/" className={linkBase}>
							Home
						</Link>

						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									className={
										linkBase +
										" inline-flex items-center gap-1 rounded-full px-3 py-2 hover:bg-white/5"
									}
									aria-label="Open hotels menu"
								>
									Our Hotels <ChevronDown className="h-4 w-4 opacity-80" />
								</button>
							</PopoverTrigger>
							<PopoverContent
								align="start"
								sideOffset={10}
								className="w-80 p-2 glass-dark text-ivory border-white/10 rounded-2xl shadow-2xl"
							>
								<div className="px-2 py-2">
									<p className="text-xs tracking-[0.25em] uppercase text-ivory/60">
										Destinations
									</p>
									<Link
										href="/hotels"
										className="mt-2 block rounded-xl px-3 py-2 text-sm font-medium text-ivory hover:bg-white/5 hover:text-gold"
									>
										View all hotels
									</Link>
								</div>
								<div className="max-h-72 overflow-auto px-1 pb-1">
									{hotels.map((hotel) => (
										<Link
											key={hotel._id}
											href={`/hotels/${hotel._id}`}
											className="block rounded-xl px-3 py-2 text-sm text-ivory/90 hover:bg-white/5 hover:text-gold"
										>
											{hotel.name}
										</Link>
									))}
								</div>
							</PopoverContent>
						</Popover>

						<Link href="/rooms" className={linkBase}>
							Rooms
						</Link>
						<Link href="/transport" className={linkBase}>
							Transport
						</Link>
						<Link href="/contact" className={linkBase}>
							Contact
						</Link>

						<div className="ml-2">
							<AvailabilitySearch hotels={hotels} />
						</div>
					</div>

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
												{user.name?.slice(0, 1).toUpperCase()}
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
										<SheetClose asChild>
											<Link
												href="/"
												className="rounded-xl px-3 py-3 text-sm font-medium text-ivory hover:bg-white/5"
											>
												Home
											</Link>
										</SheetClose>

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
												{hotelsPreview.map((hotel) => (
													<SheetClose asChild key={hotel._id}>
														<Link
															href={`/hotels/${hotel._id}`}
															className="rounded-lg px-2 py-2 text-sm text-ivory/80 hover:bg-white/5 hover:text-gold"
														>
															{hotel.name}
														</Link>
													</SheetClose>
												))}
											</div>
										</details>

										<SheetClose asChild>
											<Link
												href="/rooms"
												className="rounded-xl px-3 py-3 text-sm font-medium text-ivory hover:bg-white/5"
											>
												Rooms
											</Link>
										</SheetClose>

										<SheetClose asChild>
											<Link
												href="/transport"
												className="rounded-xl px-3 py-3 text-sm font-medium text-ivory hover:bg-white/5"
											>
												Transport
											</Link>
										</SheetClose>

										<SheetClose asChild>
											<Link
												href="/contact"
												className="rounded-xl px-3 py-3 text-sm font-medium text-ivory hover:bg-white/5"
											>
												Contact
											</Link>
										</SheetClose>
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
															{user.name?.slice(0, 1).toUpperCase()}
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
