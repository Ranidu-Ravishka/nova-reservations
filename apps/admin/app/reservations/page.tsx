"use client";

import { useEffect, useState } from "react";
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
import { api } from "@/lib/api";

/* ---------------- TYPES ---------------- */

type ReservationStatus = "CONFIRMED" | "CANCELLED";

interface Reservation {
	_id: string;
	status: ReservationStatus;
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	userId: {
		name: string;
		email: string;
	};
	roomId: {
		name: string;
		hotelId?: {
			name: string;
		};
	};
}

/* ---------------- COMPONENT ---------------- */

export default function ReservationsPage() {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [selected, setSelected] = useState<Reservation | null>(null);

	/* ---------------- FETCH REAL DATA ---------------- */

	useEffect(() => {
		api.get("/reservations").then((res) => setReservations(res.data));
	}, []);

	/* ---------------- UPDATE STATUS ---------------- */

	const updateStatus = async (id: string, status: ReservationStatus) => {
		await api.put(`/reservations/${id}`, { status });

		setReservations((prev) =>
			prev.map((r) => (r._id === id ? { ...r, status } : r)),
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
								<TableHead>Customer</TableHead>
								<TableHead>Hotel</TableHead>
								<TableHead>Room</TableHead>
								<TableHead>Dates</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Total</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{reservations.map((r) => (
								<TableRow key={r._id}>
									<TableCell>
										{r.userId?.name}
										<div className="text-xs text-gray-500">
											{r.userId?.email}
										</div>
									</TableCell>

									<TableCell>{r.roomId?.hotelId?.name || "—"}</TableCell>

									<TableCell>{r.roomId?.name}</TableCell>

									<TableCell>
										{new Date(r.checkIn).toLocaleDateString()} →{" "}
										{new Date(r.checkOut).toLocaleDateString()}
									</TableCell>

									<TableCell>
										<Badge
											variant={
												r.status === "CONFIRMED" ? "default" : "destructive"
											}
										>
											{r.status}
										</Badge>
									</TableCell>

									<TableCell>${r.totalPrice}</TableCell>

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

			{/* -------- STATUS MODAL -------- */}

			<Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Update Reservation Status</DialogTitle>
					</DialogHeader>

					{selected && (
						<Select
							defaultValue={selected.status}
							onValueChange={(value) =>
								updateStatus(selected._id, value as ReservationStatus)
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="CONFIRMED">Confirmed</SelectItem>
								<SelectItem value="CANCELLED">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
