"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaPaypal } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BookingPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [date, setDate] = useState("");
	const [loading, setLoading] = useState(false);

	const handleBooking = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simulate booking logic
		setTimeout(() => {
			setLoading(false);
			toast.success("Booking successful! Payment processed via PayPal.");
			setName("");
			setEmail("");
			setDate("");
		}, 1500);
	};

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 py-12 px-4">
			<Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl bg-white/90">
				<CardHeader className="flex flex-col items-center gap-2">
					<FaPaypal className="text-5xl text-blue-600 mb-2" />
					<CardTitle className="text-2xl font-bold text-gray-800">
						Book Your Stay
					</CardTitle>
					<p className="text-gray-500 text-sm">
						Secure your reservation and pay easily with PayPal.
					</p>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleBooking} className="flex flex-col gap-4">
						<Input
							placeholder="Full Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							className="rounded-xl"
						/>
						<Input
							type="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="rounded-xl"
						/>
						<Input
							type="date"
							placeholder="Booking Date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
							className="rounded-xl"
						/>
						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 mt-2 flex items-center justify-center gap-2"
							disabled={loading}
						>
							<FaPaypal className="text-lg" />
							{loading ? "Processing..." : "Book & Pay with PayPal"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
