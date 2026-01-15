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

// Dummy data (replace with API)
type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type Reservation = {
	id: string;
	customer: string;
	hotel: string;
	room: string;
	checkIn: string;
	checkOut: string;
	status: ReservationStatus;
};

const initialReservations: Reservation[] = [
	{
		id: "RES-001",
		customer: "John Doe",
		hotel: "Nova Colombo",
		room: "Deluxe Suite",
		checkIn: "2026-02-01",
		checkOut: "2026-02-05",
		status: "CONFIRMED",
	},
	{
		id: "RES-002",
		customer: "Anna Silva",
		hotel: "Nova Kandy",
		room: "Luxury Room",
		checkIn: "2026-02-03",
		checkOut: "2026-02-04",
		status: "PENDING",
	},
];

export default function ReservationsPage() {
	const [reservations, setReservations] =
		useState<Reservation[]>(initialReservations);
	const [selected, setSelected] = useState<Reservation | null>(null);

	const updateStatus = (id: string, status: ReservationStatus) => {
		setReservations((prev) =>
			prev.map((r) => (r.id === id ? { ...r, status } : r)),
		);
		setSelected(null);
	};

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Reservations Management</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Hotel</TableHead>
								<TableHead>Room</TableHead>
								<TableHead>Dates</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reservations.map((r) => (
								<TableRow key={r.id}>
									<TableCell>{r.id}</TableCell>
									<TableCell>{r.customer}</TableCell>
									<TableCell>{r.hotel}</TableCell>
									<TableCell>{r.room}</TableCell>
									<TableCell>
										{r.checkIn} → {r.checkOut}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												r.status === "CONFIRMED"
													? "default"
													: r.status === "CANCELLED"
														? "destructive"
														: "secondary"
											}
										>
											{r.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<Button
											size="sm"
											variant="outline"
											onClick={() => setSelected(r)}
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
						<DialogTitle>Update Reservation Status</DialogTitle>
					</DialogHeader>
					{selected && (
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Reservation <strong>{selected.id}</strong>
							</p>
							<Select
								defaultValue={selected?.status}
								onValueChange={(value) =>
									selected &&
									updateStatus(selected.id, value as ReservationStatus)
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
