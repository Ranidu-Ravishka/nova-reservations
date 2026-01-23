"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { getErrorMessage } from "@/lib/errors";
import { socket } from "@/lib/socket";

/* ---------------- TYPES ---------------- */

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface Reservation {
	_id: string;
	status: ReservationStatus;
	checkIn: string;
	checkOut: string;
	totalPrice: number;
	userId?: {
		name?: string;
		email?: string;
	};
	hotelName?: string;
	roomName?: string;
	roomsBooked?: number;
}

/* ---------------- COMPONENT ---------------- */

export default function ReservationsPage() {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [selected, setSelected] = useState<Reservation | null>(null);
	const [statusFilter, setStatusFilter] = useState<"ALL" | ReservationStatus>(
		"ALL",
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	/* ---------------- FETCH REAL DATA ---------------- */

	const loadReservations = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get("/reservations");
			setReservations(res.data);
		} catch (e) {
			setError(getErrorMessage(e, "Failed to load reservations"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadReservations();
	}, [loadReservations]);

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
		const previous = reservations;
		setUpdatingId(id);
		setReservations((prev) =>
			prev.map((r) => (r._id === id ? { ...r, status } : r)),
		);
		try {
			await api.put(`/reservations/${id}`, { status });
			toast.success("Reservation status updated");
			setSelected(null);
		} catch (e) {
			setReservations(previous);
			toast.error(getErrorMessage(e, "Failed to update reservation"));
		} finally {
			setUpdatingId(null);
		}
	};

	const filtered = useMemo(() => {
		return reservations.filter((r) =>
			statusFilter === "ALL" ? true : r.status === statusFilter,
		);
	}, [reservations, statusFilter]);

	const pendingCount = reservations.filter(
		(r) => r.status === "PENDING",
	).length;
	const confirmedCount = reservations.filter(
		(r) => r.status === "CONFIRMED",
	).length;

	return (
		<PageContainer>
			<PageHeader
				title="Reservations"
				description="Review and manage guest reservations"
				actions={
					<div className="flex items-center gap-2">
						<div className="w-44">
							<Select
								value={statusFilter}
								onValueChange={(v) =>
									setStatusFilter(v as ReservationStatus | "ALL")
								}
							>
								<SelectTrigger className="bg-white/5 border-white/10">
									<SelectValue placeholder="Filter status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ALL">All</SelectItem>
									<SelectItem value="PENDING">Pending</SelectItem>
									<SelectItem value="CONFIRMED">Confirmed</SelectItem>
									<SelectItem value="CANCELLED">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button variant="outline" onClick={loadReservations}>
							Refresh
						</Button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Total Reservations
						</p>
						<p className="text-3xl font-display mt-2">{reservations.length}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Pending
						</p>
						<p className="text-3xl font-display mt-2">{pendingCount}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Confirmed
						</p>
						<p className="text-3xl font-display mt-2">{confirmedCount}</p>
					</CardContent>
				</Card>
			</div>

			{error ? (
				<EmptyState
					title="Couldn’t load reservations"
					description={error}
					action={<RetryButton onClick={loadReservations} />}
				/>
			) : null}

			{!error && !loading && filtered.length === 0 ? (
				<EmptyState
					title="No reservations"
					description="Try changing the filter or check back later."
					action={
						<Button variant="outline" onClick={loadReservations}>
							Refresh
						</Button>
					}
				/>
			) : null}

			{!error && (loading || filtered.length > 0) ? (
				<div className="luxury-panel rounded-2xl overflow-hidden">
					{loading ? (
						<div className="p-6 text-muted-foreground">
							Loading reservations…
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
											{r.userId?.name || "—"}
											<div className="text-xs text-muted-foreground">
												{r.userId?.email || ""}
											</div>
										</TableCell>

										<TableCell>{r.hotelName || "—"}</TableCell>
										<TableCell>{r.roomName || "—"}</TableCell>
										<TableCell>
											{new Date(r.checkIn).toLocaleDateString()} →{" "}
											{new Date(r.checkOut).toLocaleDateString()}
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
										<TableCell>${r.totalPrice}</TableCell>
										<TableCell className="text-right">
											<Button
												size="sm"
												variant="outline"
												onClick={() => setSelected(r)}
												disabled={updatingId === r._id}
											>
												Manage
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			) : null}

			{/* -------- STATUS MODAL -------- */}

			<Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
				<DialogContent className="max-w-md luxury-panel border-white/10">
					<DialogHeader>
						<DialogTitle>Update Reservation Status</DialogTitle>
					</DialogHeader>

					{selected && (
						<Select
							defaultValue={selected.status}
							onValueChange={(value) =>
								updateStatus(selected._id, value as ReservationStatus)
							}
							disabled={updatingId === selected._id}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PENDING">Pending</SelectItem>
								<SelectItem value="CONFIRMED">Confirmed</SelectItem>
								<SelectItem value="CANCELLED">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					)}
				</DialogContent>
			</Dialog>
		</PageContainer>
	);
}
