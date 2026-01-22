export const dynamic = "force-dynamic";

import Link from "next/link";
import { HotelsListingSection } from "@/components/sections/hotels";

export default async function HotelsPage() {
	return (
		<main className="min-h-screen bg-cream">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: "url(/hotels-hero-sri-lanka-collage.jpg)" }}
				/>
				<div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/40 to-charcoal/10" />

				<div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
					<span className="inline-flex items-center rounded-full bg-ivory/10 px-4 py-2 text-xs tracking-[0.3em] uppercase text-ivory/80 backdrop-blur">
						Sri Lanka stays
					</span>
					<h1 className="mt-6 text-5xl md:text-6xl font-serif font-semibold text-ivory text-balance">
						Hotels crafted for comfort
					</h1>
					<p className="mt-5 text-lg md:text-xl text-ivory/80 max-w-2xl leading-relaxed">
						Explore destinations, compare properties, and book rooms with
						confidence — from coastal escapes to mountain retreats.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row gap-4">
						<a
							href="#hotels"
							className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 text-sm font-medium text-charcoal hover:bg-gold/90 transition"
						>
							Browse hotels
						</a>
						<Link
							href="/rooms"
							className="inline-flex items-center justify-center rounded-full border border-ivory/25 bg-ivory/5 px-8 py-4 text-sm font-medium text-ivory hover:bg-ivory/10 transition"
						>
							View rooms
						</Link>
					</div>

					<div className="mt-10 grid gap-4 sm:grid-cols-3 max-w-3xl">
						{[
							{
								title: "Curated locations",
								desc: "Colombo, Kandy, Galle, Nuwara Eliya",
							},
							{
								title: "Verified amenities",
								desc: "Pool, spa, dining, Wi‑Fi and more",
							},
							{
								title: "Seamless booking",
								desc: "Fast search, clear details, easy checkout",
							},
						].map((item) => (
							<div
								key={item.title}
								className="rounded-2xl bg-slate-900 backdrop-blur border border-ivory/15 p-4"
							>
								<p className="text-ivory font-medium">{item.title}</p>
								<p className="mt-1 text-sm text-ivory/70">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Hotels Listing */}
			<div id="hotels">
				<HotelsListingSection />
			</div>
		</main>
	);
}
