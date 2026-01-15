"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Dummy transport bookings (replace with API)
type TransportBooking = {
	id: string;
	customer: string;
	service: string;
	vehicle: string;
	route: string;
	date: string;
	status: "CONFIRMED" | "PENDING" | "CANCELLED";
};

const initialBookings: TransportBooking[] = [
	{
		id: "TR-001",
		customer: "Daniel Perera",
		service: "Airport Pickup",
		vehicle: "Luxury Sedan",
		route: "BIA → Nova Colombo",
		date: "2026-02-01",
		status: "CONFIRMED",
	},
	{
		id: "TR-002",
		customer: "Sarah Fernando",
		service: "Intercity Transfer",
		vehicle: "SUV",
		route: "Colombo → Kandy",
		date: "2026-02-03",
		status: "PENDING",
	},
];

export default function TransportBookingsPage() {
	const [bookings, setBookings] = useState<TransportBooking[]>(initialBookings);
	const [selected, setSelected] = useState<TransportBooking | null>(null);

	const updateStatus = (id: string, status: TransportBooking["status"]) => {
		setBookings((prev) =>
			prev.map((b) => (b.id === id ? { ...b, status } : b)),
		);
		setSelected(null);
	};

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Transport Bookings Management</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Service</TableHead>
								<TableHead>Vehicle</TableHead>
								<TableHead>Route</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{bookings.map((b) => (
								<TableRow key={b.id}>
									<TableCell>{b.id}</TableCell>
									<TableCell>{b.customer}</TableCell>
									<TableCell>{b.service}</TableCell>
									<TableCell>{b.vehicle}</TableCell>
									<TableCell>{b.route}</TableCell>
									<TableCell>{b.date}</TableCell>
									<TableCell>
										<Badge
											variant={
												b.status === "CONFIRMED"
													? "default"
													: b.status === "CANCELLED"
														? "destructive"
														: "secondary"
											}
										>
											{b.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											size="sm"
											variant="outline"
											onClick={() => setSelected(b)}
										>
											Manage
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Update Transport Booking</DialogTitle>
					</DialogHeader>
					{selected && (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Booking <strong>{selected.id}</strong>
							</p>
							<Select
								defaultValue={selected.status}
								onValueChange={(value) =>
									updateStatus(selected.id, value as TransportBooking["status"])
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="PENDING">Pending</SelectItem>
									<SelectItem value="CONFIRMED">Confirmed</SelectItem>
									<SelectItem value="CANCELLED">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
