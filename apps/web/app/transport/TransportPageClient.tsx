"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Car,
	Check,
	Clock,
	Loader2,
	MapPin,
	Shield,
	Sparkles,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, createTransportRequest, type TransportService } from "@/lib/api";
import { cn } from "@/lib/utils";

const ALL_TYPES_VALUE = "__ALL_TYPES__";

const TYPE_OPTIONS = [
	{ value: ALL_TYPES_VALUE, label: "All types" },
	{ value: "Airport Pickup", label: "Airport pickup" },
	{ value: "Private Car", label: "Private car" },
	{ value: "Executive Van", label: "Executive van" },
	{ value: "Luxury", label: "Luxury" },
];

function formatCurrencyLKR(value: number) {
	try {
		return new Intl.NumberFormat("en-LK", {
			style: "currency",
			currency: "LKR",
			maximumFractionDigits: 0,
		}).format(value);
	} catch {
		return `LKR ${Math.round(value)}`;
	}
}

function getTypeIcon(type?: string) {
	const t = (type ?? "").toLowerCase();
	if (t.includes("van") || t.includes("group")) return Users;
	return Car;
}

function scoreService(
	service: TransportService,
	query: {
		from: string;
		to: string;
		type: string;
		passengers: number;
	},
) {
	let score = 0;
	const route = (service.route ?? "").toLowerCase();
	const type = (service.type ?? "").toLowerCase();

	if (query.from && route.includes(query.from.toLowerCase())) score += 3;
	if (query.to && route.includes(query.to.toLowerCase())) score += 3;
	if (query.type && type.includes(query.type.toLowerCase())) score += 2;
	if (query.passengers > 0 && (service.capacity ?? 0) >= query.passengers)
		score += 2;
	return score;
}

export default function TransportPageClient({
	initialTransports,
}: {
	initialTransports: TransportService[];
}) {
	const [transports, setTransports] = useState<TransportService[]>(
		initialTransports ?? [],
	);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [typeFilter, setTypeFilter] = useState(ALL_TYPES_VALUE);
	const [passengers, setPassengers] = useState<number>(2);
	const [date, setDate] = useState<Date | undefined>(new Date());

	const [selected, setSelected] = useState<TransportService | null>(null);
	const [requestOpen, setRequestOpen] = useState(false);
	const [requestSubmitting, setRequestSubmitting] = useState(false);
	const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

	const [requestName, setRequestName] = useState("");
	const [requestEmail, setRequestEmail] = useState("");
	const [requestPhone, setRequestPhone] = useState("");
	const [requestNotes, setRequestNotes] = useState("");

	const sortedFiltered = useMemo(() => {
		const effectiveTypeFilter =
			typeFilter === ALL_TYPES_VALUE ? "" : (typeFilter ?? "");
		const query = { from, to, type: effectiveTypeFilter, passengers };
		const filtered = transports
			.map((s) => ({ s, score: scoreService(s, query) }))
			.filter(({ s }) => {
				const capOk = passengers <= 0 ? true : (s.capacity ?? 0) >= passengers;
				const typeOk =
					!effectiveTypeFilter ||
					(s.type ?? "")
						.toLowerCase()
						.includes(effectiveTypeFilter.toLowerCase());
				return capOk && typeOk;
			})
			.sort((a, b) => {
				if (b.score !== a.score) return b.score - a.score;
				return (a.s.price ?? 0) - (b.s.price ?? 0);
			})
			.map(({ s }) => s);

		return filtered;
	}, [transports, from, to, typeFilter, passengers]);

	async function refresh() {
		setRefreshing(true);
		setError(null);
		try {
			const res = await api.get<TransportService[]>("/transports");
			setTransports(res.data ?? []);
		} catch (e: unknown) {
			setError(
				e && typeof e === "object" && "message" in e
					? String((e as { message?: unknown }).message ?? "Failed to load")
					: "Failed to load transport services",
			);
		} finally {
			setRefreshing(false);
		}
	}

	function openRequest(service: TransportService) {
		setSelected(service);
		setRequestSuccess(null);
		setRequestNotes("");
		setRequestOpen(true);
	}

	async function submitRequest() {
		if (!selected) return;
		setRequestSubmitting(true);
		setError(null);
		setRequestSuccess(null);
		try {
			const payload = {
				transportId: selected._id,
				name: requestName,
				email: requestEmail,
				phone: requestPhone,
				pickupLocation: from || undefined,
				dropoffLocation: to || undefined,
				pickupDate: date ? date.toISOString() : undefined,
				passengers,
				notes: requestNotes || undefined,
			};

			const created = await createTransportRequest(payload);
			setRequestSuccess(
				`Request sent. Reference: ${created?._id ?? "(pending)"}`,
			);
		} catch (e: unknown) {
			setError(
				e && typeof e === "object" && "response" in e
					? // @ts-expect-error axios error
						(e.response?.data?.message ?? "Failed to send request")
					: "Failed to send request",
			);
		} finally {
			setRequestSubmitting(false);
		}
	}

	return (
		<div className="bg-background">
			{/* Hero */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0">
					<Image
						src="https://movenpickresortcamranh.com/wp-content/uploads/2022/06/Untitled-design-14.png"
						alt="Luxury chauffeur transport"
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-background" />
					<div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.6)_1px,transparent_0)] bg-size-[32px_32px]" />
				</div>

				<div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-8 lg:pt-24">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55 }}
						className="max-w-2xl"
					>
						<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/90 backdrop-blur">
							<Sparkles className="h-4 w-4" />
							<span className="text-sm">
								Premium private transport across Sri Lanka
							</span>
						</div>
						<h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
							Transport services — seamless pickups, elegant transfers
						</h1>
						<p className="mt-5 text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
							Browse available routes and vehicles, then send a request in
							seconds. Transparent pricing, professional drivers, and 24/7
							support.
						</p>

						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Button
								onClick={() =>
									window?.document
										.getElementById("transport-search")
										?.scrollIntoView({ behavior: "smooth", block: "start" })
								}
								className="rounded-full"
							>
								Find my transfer
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
							<Link href="/contact">
								<Button variant="secondary" className="rounded-full">
									Talk to concierge
								</Button>
							</Link>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, delay: 0.08 }}
						id="transport-search"
						className="mt-10"
					>
						<Card className="border-white/10 bg-white/6 backdrop-blur-xl">
							<CardHeader className="pb-3">
								<CardTitle className="text-white">Search & request</CardTitle>
								<CardDescription className="text-white/65">
									We’ll match you with the best available transport.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
								<div className="space-y-2">
									<Label className="text-white/80">From</Label>
									<div className="relative">
										<MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
										<Input
											value={from}
											onChange={(e) => setFrom(e.target.value)}
											placeholder="e.g. Airport"
											className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-white/40"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-white/80">To</Label>
									<div className="relative">
										<MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
										<Input
											value={to}
											onChange={(e) => setTo(e.target.value)}
											placeholder="e.g. Colombo"
											className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-white/40"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label className="text-white/80">Date</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="secondary"
												className={cn(
													"w-full justify-start rounded-md bg-white/5 border border-white/15 text-white hover:bg-white/10",
													!date && "text-white/60",
												)}
											>
												<Clock className="mr-2 h-4 w-4" />
												{date ? format(date, "PP") : "Pick a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={date}
												onSelect={setDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>

								<div className="space-y-2">
									<Label className="text-white/80">Passengers</Label>
									<Input
										type="number"
										min={1}
										max={30}
										value={passengers}
										onChange={(e) => setPassengers(Number(e.target.value) || 1)}
										className="bg-white/5 border-white/15 text-white"
									/>
								</div>

								<div className="space-y-2">
									<Label className="text-white/80">Type</Label>
									<Select value={typeFilter} onValueChange={setTypeFilter}>
										<SelectTrigger className="bg-white/5 border-white/15 text-white">
											<SelectValue placeholder="All types" />
										</SelectTrigger>
										<SelectContent>
											{TYPE_OPTIONS.map((opt) => (
												<SelectItem key={opt.label} value={opt.value}>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</CardContent>
							<CardFooter className="flex flex-wrap items-center justify-between gap-3">
								<div className="text-sm text-white/65">
									Showing{" "}
									<span className="text-white">{sortedFiltered.length}</span>{" "}
									options
									{error ? (
										<span className="ml-2 text-red-200">{error}</span>
									) : null}
								</div>
								<Button
									variant="secondary"
									onClick={refresh}
									disabled={refreshing}
									className="rounded-full"
								>
									{refreshing ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Refreshing
										</>
									) : (
										"Refresh"
									)}
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				</div>
			</section>

			{/* Highlights */}
			<section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
				<div className="grid gap-6 md:grid-cols-3">
					{[
						{
							icon: Shield,
							title: "Professional drivers",
							desc: "Verified, punctual, and discreet — premium service by default.",
						},
						{
							icon: Clock,
							title: "On-time pickups",
							desc: "Airport arrivals, hotel transfers, and custom routes — 24/7.",
						},
						{
							icon: Check,
							title: "Transparent pricing",
							desc: "See prices upfront per route, with capacity clearly displayed.",
						},
					].map((f, idx) => (
						<motion.div
							key={f.title}
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.45, delay: idx * 0.06 }}
						>
							<Card className="h-full">
								<CardHeader>
									<div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
										<f.icon className="h-5 w-5 text-primary" />
									</div>
									<CardTitle className="text-base">{f.title}</CardTitle>
									<CardDescription>{f.desc}</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			{/* Results */}
			<section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
				<div className="flex items-end justify-between gap-6">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight">
							Available transport options
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Data is loaded from the backend endpoint{" "}
							<span className="font-medium">/api/transports</span>.
						</p>
					</div>
				</div>

				<div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{sortedFiltered.map((service, idx) => {
						const Icon = getTypeIcon(service.type);
						return (
							<motion.div
								key={service._id}
								initial={{ opacity: 0, y: 14 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-80px" }}
								transition={{ duration: 0.45, delay: Math.min(idx, 8) * 0.03 }}
							>
								<Card className="h-full overflow-hidden">
									<CardHeader>
										<div className="flex items-start justify-between gap-4">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
														<Icon className="h-5 w-5 text-primary" />
													</div>
													<CardTitle className="text-base">
														{service.type}
													</CardTitle>
												</div>
												<CardDescription className="text-sm">
													{service.route}
												</CardDescription>
											</div>
											<div className="text-right">
												<div className="text-lg font-semibold">
													{formatCurrencyLKR(service.price ?? 0)}
												</div>
												<div className="text-xs text-muted-foreground">
													per route
												</div>
											</div>
										</div>

										<div className="mt-3 flex flex-wrap gap-2">
											<Badge variant="secondary">
												{service.capacity ?? 0} seats
											</Badge>
											<Badge variant="outline">AC</Badge>
											<Badge variant="outline">Chauffeur</Badge>
											{(service.type ?? "")
												.toLowerCase()
												.includes("airport") ? (
												<Badge className="bg-primary text-primary-foreground">
													Airport
												</Badge>
											) : null}
										</div>
									</CardHeader>

									<CardContent className="space-y-3">
										<div className="grid gap-2 text-sm text-muted-foreground">
											<div className="flex items-center justify-between">
												<span>Capacity</span>
												<span className="text-foreground">
													{service.capacity ?? 0}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span>Best for</span>
												<span className="text-foreground">
													{(service.capacity ?? 0) >= 6
														? "Groups"
														: "Couples & small parties"}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span>Availability</span>
												<span className="text-foreground">
													Subject to confirmation
												</span>
											</div>
										</div>
									</CardContent>

									<CardFooter className="flex items-center justify-between gap-3">
										<Button
											variant="secondary"
											className="w-full"
											onClick={() => openRequest(service)}
										>
											Request this transfer
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						);
					})}
				</div>

				{sortedFiltered.length === 0 ? (
					<div className="mt-10 rounded-xl border bg-muted/30 p-8 text-center">
						<p className="text-sm text-muted-foreground">
							No services match your filters. Try changing route or passenger
							count.
						</p>
						<div className="mt-4">
							<Button
								variant="secondary"
								onClick={() => {
									setFrom("");
									setTo("");
									setTypeFilter("");
									setPassengers(2);
								}}
							>
								Reset filters
							</Button>
						</div>
					</div>
				) : null}
			</section>

			{/* Request dialog */}
			<Dialog open={requestOpen} onOpenChange={setRequestOpen}>
				<DialogContent className="sm:max-w-140">
					<DialogHeader>
						<DialogTitle>Request a transfer</DialogTitle>
						<DialogDescription>
							We’ll confirm availability and get back to you shortly.
						</DialogDescription>
					</DialogHeader>

					{selected ? (
						<div className="rounded-lg border bg-muted/20 p-4">
							<div className="flex items-start justify-between gap-4">
								<div>
									<div className="text-sm font-medium">{selected.type}</div>
									<div className="text-sm text-muted-foreground">
										{selected.route}
									</div>
								</div>
								<div className="text-right">
									<div className="text-sm font-semibold">
										{formatCurrencyLKR(selected.price ?? 0)}
									</div>
									<div className="text-xs text-muted-foreground">
										{selected.capacity ?? 0} seats
									</div>
								</div>
							</div>
						</div>
					) : null}

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label>Name</Label>
							<Input
								value={requestName}
								onChange={(e) => setRequestName(e.target.value)}
								placeholder="Your name"
							/>
						</div>
						<div className="space-y-2">
							<Label>Phone</Label>
							<Input
								value={requestPhone}
								onChange={(e) => setRequestPhone(e.target.value)}
								placeholder="+94…"
							/>
						</div>
						<div className="space-y-2">
							<Label>Email</Label>
							<Input
								value={requestEmail}
								onChange={(e) => setRequestEmail(e.target.value)}
								placeholder="you@example.com"
							/>
						</div>
						<div className="space-y-2">
							<Label>Passengers</Label>
							<Input value={passengers} readOnly />
						</div>
					</div>

					<div className="space-y-2">
						<Label>Notes</Label>
						<Textarea
							value={requestNotes}
							onChange={(e) => setRequestNotes(e.target.value)}
							placeholder="Flight number, luggage, child seat, special requests…"
							className="min-h-22.5"
						/>
					</div>

					{requestSuccess ? (
						<div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
							{requestSuccess}
						</div>
					) : null}
					{error ? (
						<div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
							{error}
						</div>
					) : null}

					<DialogFooter className="gap-2 sm:gap-0">
						<Button variant="secondary" onClick={() => setRequestOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={submitRequest}
							disabled={requestSubmitting || !selected}
						>
							{requestSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending…
								</>
							) : (
								"Send request"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
