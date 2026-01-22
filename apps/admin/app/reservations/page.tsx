"use client";

import { useEffect, useMemo, useState } from "react";
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
import { socket } from "@/lib/socket";

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
	const [statusFilter, setStatusFilter] = useState<"ALL" | ReservationStatus>(
		"ALL",
	);
	const [loading, setLoading] = useState(true);

	/* ---------------- FETCH REAL DATA ---------------- */

	useEffect(() => {
		setLoading(true);
		api
			.get("/reservations")
			.then((res) => setReservations(res.data))
			.finally(() => setLoading(false));
	}, []);

	// Real-time status updates
	useEffect(() => {
		const handler = (payload: { id: string; status: ReservationStatus }) => {
			setReservations((prev) =>
				prev.map((r) =>
					r._id === payload.id ? { ...r, status: payload.status } : r,
				),
			);
		};
		socket.on("reservation:status", handler);
		return () => {
			socket.off("reservation:status", handler);
		};
	}, []);

	/* ---------------- UPDATE STATUS ---------------- */

	const updateStatus = async (id: string, status: ReservationStatus) => {
		await api.put(`/reservations/${id}`, { status });

		setReservations((prev) =>
			prev.map((r) => (r._id === id ? { ...r, status } : r)),
		);

		setSelected(null);
	};

	const filtered = useMemo(() => {
		return reservations.filter((r) =>
			statusFilter === "ALL" ? true : r.status === statusFilter,
		);
	}, [reservations, statusFilter]);

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						Reservations Management
						<div className="w-40">
							<Select
								value={statusFilter}
								onValueChange={(v) =>
									setStatusFilter(v as ReservationStatus | "ALL")
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Filter status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All</SelectItem>
									<SelectItem value="CONFIRMED">Confirmed</SelectItem>
									<SelectItem value="CANCELLED">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardTitle>
				</CardHeader>

				<CardContent>
					{loading ? (
						<div className="p-4 text-muted-foreground">
							Loading reservations...
						</div>
					) : (
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
								{filtered.map((r) => (
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
					)}
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
