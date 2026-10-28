"use client";

import { Edit2, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import type { Room } from "@/types/room";
import RoomForm from "./RoomForm";

export default function RoomsPage() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [activeFilter, setActiveFilter] = useState<
		"all" | "active" | "inactive"
	>("all");

	const loadRooms = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get("/rooms/admin");
			setRooms(res.data);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Failed to load rooms"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadRooms();
	}, [loadRooms]);

	const toggleActive = async (room: Room) => {
		const nextIsActive = !room.isActive;
		if (!confirm(`${nextIsActive ? "Activate" : "Deactivate"} this room?`)) {
			return;
		}
		try {
			if (nextIsActive) {
				await api.put(`/rooms/${room._id}`, { isActive: true });
			} else {
				await api.delete(`/rooms/${room._id}`);
			}
			setRooms((previous) =>
				previous.map((current) =>
					current._id === room._id
						? { ...current, isActive: nextIsActive }
						: current,
				),
			);
			toast.success(`Room ${nextIsActive ? "activated" : "deactivated"}`);
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to update room status"));
		}
	};

	const filteredRooms = rooms.filter((r) => {
		const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
		const matchesStatus =
			activeFilter === "all" ||
			(activeFilter === "active" && r.isActive) ||
			(activeFilter === "inactive" && !r.isActive);
		return matchesSearch && matchesStatus;
	});

	const activeCount = rooms.filter((room) => room.isActive).length;

	return (
		<PageContainer>
			<PageHeader
				title="Rooms"
				description="Manage room inventory and pricing"
				actions={
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" /> Add Room
							</Button>
						</DialogTrigger>
						<DialogContent
							className="luxury-panel border-white/10"
							aria-describedby={undefined}
						>
							<RoomForm
								room={editingRoom}
								onSuccess={() => {
									setEditingRoom(undefined);
									setOpen(false);
									loadRooms();
								}}
							/>
						</DialogContent>
					</Dialog>
				}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Total Rooms
						</p>
						<p className="text-3xl font-display mt-2">{rooms.length}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Active Room Types
						</p>
						<p className="text-3xl font-display mt-2">{activeCount}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Filtered
						</p>
						<p className="text-3xl font-display mt-2">{filteredRooms.length}</p>
					</CardContent>
				</Card>
			</div>

			{/* Search & Filters */}
			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative max-w-sm w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search rooms..."
						className="pl-9 bg-white/5 border-white/10"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<button
						type="button"
						className={`px-3 py-1 rounded-full border border-white/10 ${activeFilter === "all" ? "bg-white/10 text-foreground" : "text-muted-foreground"}`}
						onClick={() => setActiveFilter("all")}
					>
						All
					</button>
					<button
						type="button"
						className={`px-3 py-1 rounded-full border border-white/10 ${activeFilter === "active" ? "bg-white/10 text-foreground" : "text-muted-foreground"}`}
						onClick={() => setActiveFilter("active")}
					>
						Active
					</button>
					<button
						type="button"
						className={`px-3 py-1 rounded-full border border-white/10 ${activeFilter === "inactive" ? "bg-white/10 text-foreground" : "text-muted-foreground"}`}
						onClick={() => setActiveFilter("inactive")}
					>
						Inactive
					</button>
				</div>
			</div>

			<div className="mt-4">
				{error ? (
					<EmptyState
						title="Couldn’t load rooms"
						description={error}
						action={<RetryButton onClick={loadRooms} />}
					/>
				) : loading ? (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span className="text-sm">Loading rooms…</span>
					</div>
				) : filteredRooms.length === 0 ? (
					<EmptyState
						title={search ? "No results" : "No rooms yet"}
						description={
							search
								? "Try a different search term."
								: "Create your first room to start selling nights."
						}
						action={
							<Button onClick={() => setOpen(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Add Room
							</Button>
						}
					/>
				) : (
					<div className="luxury-panel rounded-2xl overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Room</TableHead>
									<TableHead>Hotel</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{filteredRooms.map((room) => (
									<TableRow key={room._id}>
										<TableCell>{room.name}</TableCell>
										<TableCell>
											{typeof room.hotelId === "string"
												? "-"
												: (room.hotelId?.name ?? "-")}
										</TableCell>
										<TableCell>${room.pricePerNight}</TableCell>
										<TableCell>
											{room.isActive ? "Active" : "Inactive"}
										</TableCell>
										<TableCell className="text-right flex gap-2 justify-end">
											<Button
												size={room.isActive ? "icon" : "sm"}
												variant="ghost"
												aria-label={
													room.isActive ? "Deactivate room" : "Activate room"
												}
												onClick={() => {
													setEditingRoom(room);
													setOpen(true);
												}}
											>
												<Edit2 className="h-4 w-4" />
											</Button>

											<Button
												size="icon"
												variant="ghost"
												onClick={() => toggleActive(room)}
											>
												{room.isActive ? (
													<Trash2 className="h-4 w-4 text-red-500" />
												) : (
													"Activate"
												)}
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</PageContainer>
	);
}
