"use client";

import { useState } from "react";
import {
	FaCcMastercard,
	FaCcVisa,
	FaCreditCard,
	FaPaypal,
	FaShieldAlt,
} from "react-icons/fa";
import { SiApplepay, SiGooglepay } from "react-icons/si";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const paymentOptions = [
	{
		id: "paypal",
		label: "PayPal",
		description: "Fast checkout with buyer protection.",
		icon: FaPaypal,
		accent: "text-state-950",
	},
	{
		id: "card",
		label: "Credit/Debit Card",
		description: "Visa, Mastercard, and more.",
		icon: FaCreditCard,
		accent: "text-state-950",
	},
	{
		id: "applepay",
		label: "Apple Pay",
		description: "Instant checkout on Apple devices.",
		icon: SiApplepay,
		accent: "text-state-950",
	},
	{
		id: "googlepay",
		label: "Google Pay",
		description: "Tap to pay on supported devices.",
		icon: SiGooglepay,
		accent: "text-state-950",
	},
];

export default function BookingPage() {
	const [paymentMethod, setPaymentMethod] = useState("paypal");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);
		setTimeout(() => setIsSubmitted(false), 3000);
	};

	return (
		<div className="min-h-screen bg-state-950">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14">
				<div className="flex flex-col gap-2">
					<span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
						Nova Reservations
					</span>
					<h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
						Booking details
					</h1>
					<p className="text-sm text-slate-600 md:text-base">
						A clean, secure checkout with PayPal, cards, and digital wallets.
					</p>
					<div className="mt-1 flex flex-wrap items-center gap-2">
						<Badge className="bg-indigo-500 text-indigo-700">
							Instant confirmation
						</Badge>
						<Badge className="bg-emerald-500 text-emerald-700">
							Free cancellation 48h
						</Badge>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
					<Card className="border border-slate-100 bg-white shadow-sm">
						<CardHeader className="border-b border-slate-100">
							<CardTitle className="text-lg text-slate-900">
								Guest & stay details
							</CardTitle>
							<p className="text-sm text-slate-500">
								Tell us who is traveling and your preferred room.
							</p>
						</CardHeader>
						<CardContent className="pt-6">
							<form onSubmit={handleSubmit} className="flex flex-col gap-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="fullName">Full name</Label>
										<Input id="fullName" placeholder="Alex Morgan" required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email address</Label>
										<Input
											id="email"
											type="email"
											placeholder="alex@email.com"
											required
										/>
									</div>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="checkIn">Check-in</Label>
										<Input id="checkIn" type="date" required />
									</div>
									<div className="space-y-2">
										<Label htmlFor="checkOut">Check-out</Label>
										<Input id="checkOut" type="date" required />
									</div>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="guests">Guests</Label>
										<Input
											id="guests"
											type="number"
											min={1}
											defaultValue={2}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="roomType">Room type</Label>
										<Select defaultValue="deluxe">
											<SelectTrigger id="roomType">
												<SelectValue placeholder="Select a room" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="deluxe">Deluxe Suite</SelectItem>
												<SelectItem value="ocean">Ocean View</SelectItem>
												<SelectItem value="family">Family Residence</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="requests">Special requests</Label>
									<Textarea
										id="requests"
										placeholder="Airport pickup, late check-in, extra pillows..."
										className="min-h-27.5"
									/>
								</div>

								<div className="space-y-3">
									<div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
										<FaShieldAlt className="text-emerald-500" />
										Secure payments
									</div>
									<div className="grid gap-3 md:grid-cols-2">
										{paymentOptions.map((option) => {
											const Icon = option.icon;
											const isActive = paymentMethod === option.id;
											return (
												<button
													key={option.id}
													type="button"
													onClick={() => setPaymentMethod(option.id)}
													className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
														isActive
															? "border-indigo-500 bg-indigo-50 shadow-sm"
															: "border-slate-200 bg-white hover:border-indigo-200"
													}`}
												>
													<Icon className={`text-2xl ${option.accent}`} />
													<div className="space-y-1">
														<p className="text-sm font-semibold text-slate-900">
															{option.label}
														</p>
														<p className="text-xs text-slate-500">
															{option.description}
														</p>
													</div>
												</button>
											);
										})}
									</div>
								</div>

								<div className="flex flex-col gap-3">
									<Button
										type="submit"
										className="w-full rounded-2xl bg-indigo-600 py-5 text-sm font-semibold text-white hover:bg-indigo-700"
									>
										Complete booking
									</Button>
									{isSubmitted && (
										<p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
											Thanks! We’ll email your confirmation shortly.
										</p>
									)}
								</div>
							</form>
						</CardContent>
					</Card>

					<div className="space-y-6">
						<Card className="border border-slate-100 bg-white shadow-sm">
							<CardHeader className="border-b border-slate-100">
								<CardTitle className="text-lg text-slate-900">
									Reservation summary
								</CardTitle>
								<p className="text-sm text-slate-500">
									Deluxe Suite · 2 nights · 2 guests
								</p>
							</CardHeader>
							<CardContent className="space-y-4 pt-6">
								<div className="rounded-2xl bg-slate-50 px-4 py-4">
									<div className="flex items-center justify-between text-sm">
										<span className="text-slate-500">Check-in</span>
										<span className="font-medium text-slate-900">
											Feb 12, 2026
										</span>
									</div>
									<div className="mt-2 flex items-center justify-between text-sm">
										<span className="text-slate-500">Check-out</span>
										<span className="font-medium text-slate-900">
											Feb 14, 2026
										</span>
									</div>
									<div className="mt-2 flex items-center justify-between text-sm">
										<span className="text-slate-500">Location</span>
										<span className="font-medium text-slate-900">
											Mirage Bay Resort
										</span>
									</div>
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-slate-500">Room price</span>
										<span className="text-slate-900">$420.00</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-slate-500">Taxes & fees</span>
										<span className="text-slate-900">$48.00</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-slate-500">Resort credit</span>
										<span className="text-emerald-600">-$30.00</span>
									</div>
									<div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold">
										<span>Total due today</span>
										<span>$438.00</span>
									</div>
								</div>

								<div className="rounded-2xl border border-slate-200 px-4 py-4">
									<p className="text-xs font-semibold uppercase text-slate-400">
										Accepted cards
									</p>
									<div className="mt-3 flex items-center gap-3 text-xl text-slate-500">
										<FaCcVisa />
										<FaCcMastercard />
										<FaPaypal />
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="border border-indigo-100 bg-indigo-50/60 shadow-sm">
							<CardContent className="space-y-3 p-6">
								<h3 className="text-sm font-semibold text-indigo-900">
									Need help?
								</h3>
								<p className="text-sm text-indigo-700">
									Our concierge team is available 24/7 for changes and upgrades.
								</p>
								<Button
									variant="secondary"
									className="w-full rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50"
								>
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
