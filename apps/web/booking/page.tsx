"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { FaPaypal } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formatDate = (value?: string) => {
	if (!value) return "—";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "—";
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	}).format(parsed);
};

const getNights = (start?: string, end?: string) => {
	if (!start || !end) return 0;
	const startDate = new Date(start);
	const endDate = new Date(end);
	if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
		return 0;
	}
	const diff = endDate.getTime() - startDate.getTime();
	return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export default function BookingPage() {
	const searchParams = useSearchParams();
	const hotelId = searchParams.get("hotel");
	const roomId = searchParams.get("room");
	const initialCheckIn = searchParams.get("checkin") ?? "";
	const initialCheckOut = searchParams.get("checkout") ?? "";
	const initialAdults = searchParams.get("adults") ?? "2";
	const initialChildren = searchParams.get("children") ?? "0";
	const basePrice = Number(searchParams.get("price") ?? 420);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [arrival, setArrival] = useState(initialCheckIn);
	const [departure, setDeparture] = useState(initialCheckOut);
	const [guests, setGuests] = useState(
		String(Number(initialAdults) + Number(initialChildren)) || "2",
	);
	const [loading, setLoading] = useState(false);

	const nights = useMemo(
		() => getNights(arrival, departure),
		[arrival, departure],
	);
	const subtotal = Math.max(0, basePrice * Math.max(1, nights));
	const taxes = subtotal * 0.12;
	const credit = nights >= 2 ? 30 : 0;
	const total = subtotal + taxes - credit;

	const handleBooking = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			toast.success(
				"Reservation confirmed. A concierge will reach out shortly.",
			);
			setName("");
			setEmail("");
		}, 1500);
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-black text-white">
			<div className="absolute inset-0">
				<div
					className="h-full w-full bg-cover bg-center"
					style={{
						backgroundImage:
							"url('https://img.nh-hotels.net/149KYy/6E6GoB/original/NH_Collection_Colombo_Executive_Suite_Master_Bedroom.jpg')",
					}}
				/>
				<div className="absolute inset-0 bg-black/70" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_50%)]" />
			</div>

			<div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
				<div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="space-y-8">
						<div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-white/70">
							Nova Reservations
						</div>
						<div className="space-y-4">
							<h1 className="text-4xl font-light leading-tight tracking-tight sm:text-5xl">
								Booking details
							</h1>
							<p className="text-base text-white/70 sm:text-lg">
								A clean, secure checkout with PayPal, cards, and digital
								wallets—crafted for a seamless luxury experience.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80">
								Instant confirmation
							</span>
							<span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80">
								Free cancellation 48h
							</span>
						</div>

						<Card className="border border-white/10 bg-white/95 text-black shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)]">
							<CardHeader className="space-y-2">
								<CardTitle className="text-xl font-medium">
									Guest & stay details
								</CardTitle>
								<p className="text-sm text-neutral-500">
									Tell us who is traveling and your preferred room.
								</p>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleBooking} className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<Input
											placeholder="First name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
											className="rounded-2xl border-neutral-200 bg-white"
										/>
										<Input
											placeholder="Last name"
											required
											className="rounded-2xl border-neutral-200 bg-white"
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<Input
											type="email"
											placeholder="Email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="rounded-2xl border-neutral-200 bg-white"
										/>
										<Input
											placeholder="Phone number"
											required
											className="rounded-2xl border-neutral-200 bg-white"
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<Input
											type="date"
											placeholder="Check-in"
											value={arrival}
											onChange={(e) => setArrival(e.target.value)}
											required
											className="rounded-2xl border-neutral-200 bg-white"
										/>
										<Input
											type="date"
											placeholder="Check-out"
											value={departure}
											onChange={(e) => setDeparture(e.target.value)}
											required
											className="rounded-2xl border-neutral-200 bg-white"
										/>
									</div>
									<Input
										type="number"
										min={1}
										max={6}
										value={guests}
										onChange={(e) => setGuests(e.target.value)}
										placeholder="Guests"
										className="rounded-2xl border-neutral-200 bg-white"
									/>

									<div className="space-y-3">
										<p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
											Secure payments
										</p>
										<div className="grid gap-3 sm:grid-cols-2">
											<div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
												<p className="text-sm font-medium">PayPal</p>
												<p className="text-xs text-neutral-500">
													Fast checkout with buyer protection.
												</p>
											</div>
											<div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
												<p className="text-sm font-medium">Credit/Debit Card</p>
												<p className="text-xs text-neutral-500">
													Visa, Mastercard, and more.
												</p>
											</div>
											<div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
												<p className="text-sm font-medium">Apple Pay</p>
												<p className="text-xs text-neutral-500">
													Instant checkout on Apple devices.
												</p>
											</div>
											<div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
												<p className="text-sm font-medium">Google Pay</p>
												<p className="text-xs text-neutral-500">
													Tap to pay on supported devices.
												</p>
											</div>
										</div>
									</div>

									<Button
										type="submit"
										className="mt-4 w-full rounded-full bg-black py-6 text-base font-medium text-white transition hover:bg-neutral-900"
										disabled={loading}
									>
										<span className="flex items-center justify-center gap-3">
											<FaPaypal className="text-lg" />
											{loading ? "Processing..." : "Complete booking"}
										</span>
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-6">
						<Card className="border border-white/10 bg-white/95 text-black">
							<CardHeader className="space-y-1">
								<CardTitle className="text-lg font-medium">
									Reservation summary
								</CardTitle>
								<p className="text-xs text-neutral-500">
									{roomId ? `Room ${roomId}` : "Selected room"} ·{" "}
									{Math.max(1, nights)} nights · {guests} guests
								</p>
							</CardHeader>
							<CardContent className="space-y-4 text-sm">
								<div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
									<div className="flex items-center justify-between">
										<span className="text-neutral-500">Check-in</span>
										<span className="font-medium">{formatDate(arrival)}</span>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<span className="text-neutral-500">Check-out</span>
										<span className="font-medium">{formatDate(departure)}</span>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<span className="text-neutral-500">Location</span>
										<span className="font-medium">
											{hotelId ? `Hotel ${hotelId}` : "Selected hotel"}
										</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-neutral-500">Room price</span>
										<span>${subtotal.toFixed(2)}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-neutral-500">Taxes & fees</span>
										<span>${taxes.toFixed(2)}</span>
									</div>
									{credit > 0 ? (
										<div className="flex items-center justify-between text-emerald-600">
											<span>Resort credit</span>
											<span>-${credit.toFixed(2)}</span>
										</div>
									) : null}
									<div className="h-px bg-neutral-200" />
									<div className="flex items-center justify-between text-base font-semibold">
										<span>Total</span>
										<span>${total.toFixed(2)}</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border border-white/10 bg-white/95 text-black">
							<CardHeader className="space-y-1">
								<CardTitle className="text-base font-medium">
									Need help?
								</CardTitle>
								<p className="text-xs text-neutral-500">
									Our concierge team is available 24/7 for changes and upgrades.
								</p>
							</CardHeader>
							<CardContent>
								<Button className="w-full rounded-full bg-black py-4 text-sm text-white hover:bg-neutral-900">
									Chat with concierge
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
