"use client";

import { addDays, differenceInDays, format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Minus, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface Room {
	id: string;
	name: string;
	basePrice: number;
	maxGuests: number;
}

interface Hotel {
	id: string;
	name: string;
}

export function BookingWidget({ room, hotel }: { room: Room; hotel: Hotel }) {
	const [checkIn, setCheckIn] = useState<Date | undefined>(
		addDays(new Date(), 1),
	);
	const [checkOut, setCheckOut] = useState<Date | undefined>(
		addDays(new Date(), 3),
	);
	const [adults, setAdults] = useState(2);
	const [children, setChildren] = useState(0);

	const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 2;
	const subtotal = room.basePrice * nights;
	const taxes = subtotal * 0.15;
	const total = subtotal + taxes;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-3xl border border-white/10 bg-white/95 p-7 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.45)]"
		>
			{/* Price */}
			<div className="mb-6">
				<p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
					Nova Signature
				</p>
				<div className="mt-3 flex items-baseline gap-3">
					<span className="text-3xl font-light text-neutral-900">
						${room.basePrice}
					</span>
					<span className="text-sm text-neutral-500">per night</span>
				</div>
				<p className="mt-2 text-sm text-neutral-500">{hotel.name}</p>
			</div>

			{/* Date Selection */}
			<div className="mb-6 space-y-4">
				<div className="grid grid-cols-2 gap-3">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="h-14 w-full justify-start rounded-2xl border-neutral-200 bg-white text-left font-normal"
							>
								<Calendar className="mr-2 h-4 w-4 text-neutral-400" />
								<div className="flex flex-col items-start">
									<span className="text-xs text-neutral-400">Check-in</span>
									<span className="text-sm">
										{checkIn ? format(checkIn, "MMM d") : "Select"}
									</span>
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<CalendarComponent
								mode="single"
								selected={checkIn}
								onSelect={setCheckIn}
								disabled={(date) => date < new Date()}
								initialFocus
							/>
						</PopoverContent>
					</Popover>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="h-14 w-full justify-start rounded-2xl border-neutral-200 bg-white text-left font-normal"
							>
								<Calendar className="mr-2 h-4 w-4 text-neutral-400" />
								<div className="flex flex-col items-start">
									<span className="text-xs text-neutral-400">Check-out</span>
									<span className="text-sm">
										{checkOut ? format(checkOut, "MMM d") : "Select"}
									</span>
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<CalendarComponent
								mode="single"
								selected={checkOut}
								onSelect={setCheckOut}
								disabled={(date) => date <= (checkIn || new Date())}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Guests */}
				<div className="rounded-2xl border border-neutral-200 bg-white p-4">
					<div className="mb-4 flex items-center gap-2">
						<Users className="h-4 w-4 text-neutral-400" />
						<span className="text-sm text-neutral-500">Guests</span>
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-neutral-700">Adults</span>
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full border-neutral-200 bg-white"
									onClick={() => setAdults(Math.max(1, adults - 1))}
								>
									<Minus className="w-3 h-3" />
								</Button>
								<span className="w-6 text-center">{adults}</span>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full border-neutral-200 bg-white"
									onClick={() =>
										setAdults(Math.min(room.maxGuests, adults + 1))
									}
								>
									<Plus className="w-3 h-3" />
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-neutral-700">Children</span>
							<div className="flex items-center gap-3">
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full border-neutral-200 bg-white"
									onClick={() => setChildren(Math.max(0, children - 1))}
								>
									<Minus className="w-3 h-3" />
								</Button>
								<span className="w-6 text-center">{children}</span>
								<Button
									variant="outline"
									size="icon"
									className="h-8 w-8 rounded-full border-neutral-200 bg-white"
									onClick={() =>
										setChildren(Math.min(room.maxGuests - adults, children + 1))
									}
								>
									<Plus className="w-3 h-3" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Price Breakdown */}
			<div className="mb-6 space-y-2 border-t border-neutral-200 pt-4">
				<div className="flex justify-between text-sm text-neutral-600">
					<span>
						${room.basePrice} x {nights} nights
					</span>
					<span className="text-neutral-900">${subtotal}</span>
				</div>
				<div className="flex justify-between text-sm text-neutral-600">
					<span>Taxes & fees (15%)</span>
					<span className="text-neutral-900">${taxes.toFixed(0)}</span>
				</div>
				<div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-medium">
					<span className="text-neutral-900">Total</span>
					<span className="text-neutral-900">${total.toFixed(0)}</span>
				</div>
			</div>

			{/* Book Button */}
			<Link
				href={`/booking?hotel=${hotel.id}&room=${room.id}&checkin=${checkIn?.toISOString()}&checkout=${checkOut?.toISOString()}&adults=${adults}&children=${children}`}
			>
				<Button className="w-full rounded-full bg-neutral-900 py-6 text-base font-medium text-white transition hover:bg-neutral-800">
					Reserve now
				</Button>
			</Link>

			<p className="mt-4 text-center text-xs text-neutral-500">
				Free cancellation up to 48 hours before check-in.
			</p>
		</motion.div>
	);
}
