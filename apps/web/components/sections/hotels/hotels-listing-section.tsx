"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getHotelImageList, getHotelPrimaryImage } from "@/lib/hotelImages";

interface Hotel {
	_id: string;
	name: string;
	location: string;
	description?: string;
	images?: unknown;
	createdAt?: string;
}

const LOCATIONS = ["All", "Colombo", "Kandy", "Galle", "Nuwara Eliya"] as const;

type SortKey = "recommended" | "name-asc" | "name-desc" | "newest";

const SKELETON_CARD_KEYS = [
	"skeleton-1",
	"skeleton-2",
	"skeleton-3",
	"skeleton-4",
	"skeleton-5",
	"skeleton-6",
] as const;

export function HotelsListingSection() {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(true);

	const [query, setQuery] = useState("");
	const [location, setLocation] = useState<(typeof LOCATIONS)[number]>(
		LOCATIONS[0],
	);
	const [sort, setSort] = useState<SortKey>("recommended");
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/hotels", { cache: "no-store" });
				if (!res.ok) return;
				const data = (await res.json()) as Hotel[];
				if (!cancelled) setHotels(data);
			} catch (err) {
				console.error(err);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const normalized = useMemo(() => {
		const q = query.trim().toLowerCase();
		let list = hotels;

		if (location !== "All") {
			list = list.filter((h) => h.location === location);
		}

		if (q) {
			list = list.filter((h) => {
				return (
					h.name.toLowerCase().includes(q) ||
					h.location.toLowerCase().includes(q) ||
					h.description?.toLowerCase().includes(q)
				);
			});
		}

		const toTime = (value?: string) => {
			if (!value) return 0;
			const ms = Date.parse(value);
			return Number.isFinite(ms) ? ms : 0;
		};

		if (sort === "name-asc") {
			list = [...list].sort((a, b) => a.name.localeCompare(b.name));
		} else if (sort === "name-desc") {
			list = [...list].sort((a, b) => b.name.localeCompare(a.name));
		} else if (sort === "newest") {
			list = [...list].sort(
				(a, b) => toTime(b.createdAt) - toTime(a.createdAt),
			);
		}

		return list;
	}, [hotels, location, query, sort]);

	if (loading) {
		return (
			<section className="py-24 bg-cream">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{SKELETON_CARD_KEYS.map((key) => (
							<div
								key={key}
								className="rounded-2xl overflow-hidden border border-charcoal/10 bg-white"
							>
								<div className="aspect-16/10 bg-charcoal/10 animate-pulse" />
								<div className="p-5 space-y-3">
									<div className="h-4 w-24 bg-charcoal/10 animate-pulse rounded" />
									<div className="h-6 w-2/3 bg-charcoal/10 animate-pulse rounded" />
									<div className="h-4 w-full bg-charcoal/10 animate-pulse rounded" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-24 bg-cream">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">
							Discover
						</span>
						<h2 className="mt-3 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
							Our hotels
						</h2>
						<p className="mt-3 text-lg text-charcoal/70 max-w-2xl">
							Find the perfect stay across Sri Lanka — filter by destination and
							explore curated properties.
						</p>
					</div>

					<div className="w-full sm:w-125 space-y-3">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/50" />
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search by name, location, description…"
								className="w-full rounded-full border border-charcoal/15 bg-white px-11 py-3 text-sm text-charcoal placeholder:text-charcoal/45 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
								aria-label="Search hotels"
							/>
						</div>

						<div className="flex gap-3">
							<select
								value={location}
								onChange={(e) =>
									setLocation(e.target.value as (typeof LOCATIONS)[number])
								}
								className="w-full rounded-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
								aria-label="Filter by location"
							>
								{LOCATIONS.map((loc) => (
									<option key={loc} value={loc}>
										{loc}
									</option>
								))}
							</select>

							<select
								value={sort}
								onChange={(e) => setSort(e.target.value as SortKey)}
								className="rounded-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
								aria-label="Sort hotels"
							>
								<option value="recommended">Recommended</option>
								<option value="newest">Newest</option>
								<option value="name-asc">Name (A–Z)</option>
								<option value="name-desc">Name (Z–A)</option>
							</select>
						</div>
					</div>
				</div>

				<div className="mt-10 flex items-center justify-between text-sm text-charcoal/60">
					<div>
						<span className="text-charcoal font-medium">
							{normalized.length}
						</span>{" "}
						hotels
						{query.trim() ? <span> · matching “{query.trim()}”</span> : null}
					</div>
					{(query.trim() || location !== "All") && (
						<button
							type="button"
							onClick={() => {
								setQuery("");
								setLocation("All");
								setSort("recommended");
							}}
							className="rounded-full px-4 py-2 border border-charcoal/15 bg-white hover:bg-white/70 transition"
						>
							Reset
						</button>
					)}
				</div>

				{normalized.length === 0 ? (
					<div className="mt-12 rounded-2xl border border-charcoal/10 bg-white p-10 text-center">
						<p className="text-charcoal font-medium">No hotels found</p>
						<p className="mt-2 text-sm text-charcoal/60">
							Try changing filters or clearing your search.
						</p>
					</div>
				) : (
					<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{normalized.map((hotel, index) => {
							const imageList = getHotelImageList(hotel.images);
							const hero = getHotelPrimaryImage(hotel.images);
							const galleryCount = Math.max(0, imageList.length - 1);

							return (
								<motion.article
									key={hotel._id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.4,
										delay: Math.min(index * 0.05, 0.25),
									}}
									viewport={{ once: true }}
								>
									<Link
										href={`/hotels/${hotel._id}`}
										className="group block rounded-2xl overflow-hidden border border-charcoal/10 bg-white shadow-sm hover:shadow-lg transition-shadow"
									>
										<div className="relative aspect-16/10 overflow-hidden">
											<Image
												src={hero}
												alt={hotel.name}
												fill
												sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
												loading="lazy"
												className="object-cover transition-transform duration-700 group-hover:scale-105"
												unoptimized
											/>
											<div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
											<div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
												<div className="min-w-0">
													<div className="inline-flex items-center gap-2 rounded-full bg-charcoal/70 px-3 py-1 text-xs text-ivory backdrop-blur">
														<MapPin className="h-3 w-3" />
														<span className="truncate">{hotel.location}</span>
													</div>
													<h3 className="mt-3 text-xl font-serif text-ivory truncate">
														{hotel.name}
													</h3>
												</div>
												<div className="shrink-0 rounded-full bg-gold text-charcoal px-3 py-1 text-xs font-medium">
													{galleryCount > 0 ? `${galleryCount} photos` : "View"}
												</div>
											</div>
										</div>

										<div className="p-5">
											<p className="text-sm text-charcoal/70 line-clamp-2 min-h-10">
												{hotel.description ||
													"A refined stay with signature hospitality."}
											</p>
											<div className="mt-4 inline-flex items-center gap-2 text-gold font-medium">
												Explore <ArrowRight className="h-4 w-4" />
											</div>
										</div>
									</Link>
								</motion.article>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}
