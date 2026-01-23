"use client";

import { Edit2, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
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
	const [availabilityFilter, setAvailabilityFilter] = useState<
		"all" | "available" | "unavailable"
	>("all");

	const loadRooms = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get("/rooms");
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

	const remove = async (id: string) => {
		if (!confirm("Delete this room?")) return;
		try {
			await api.delete(`/rooms/${id}`);
			setRooms((prev) => prev.filter((r) => r._id !== id));
			toast.success("Room deleted");
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to delete room"));
		}
	};

	const filteredRooms = rooms.filter((r) => {
		const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
		const matchesAvailability =
			availabilityFilter === "all" ||
			(availabilityFilter === "available" && r.isAvailable) ||
			(availabilityFilter === "unavailable" && r.isAvailable === false);
		return matchesSearch && matchesAvailability;
	});

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
						<DialogContent aria-describedby={undefined}>
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

			{/* Search & Filters */}
			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative max-w-sm w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search rooms..."
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<button
						type="button"
						className={`px-3 py-1 rounded border ${availabilityFilter === "all" ? "bg-muted" : ""}`}
						onClick={() => setAvailabilityFilter("all")}
					>
						All
					</button>
					<button
						type="button"
						className={`px-3 py-1 rounded border ${availabilityFilter === "available" ? "bg-muted" : ""}`}
						onClick={() => setAvailabilityFilter("available")}
					>
						Available
					</button>
					<button
						type="button"
						className={`px-3 py-1 rounded border ${availabilityFilter === "unavailable" ? "bg-muted" : ""}`}
						onClick={() => setAvailabilityFilter("unavailable")}
					>
						Unavailable
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
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Room</TableHead>
								<TableHead>Hotel</TableHead>
								<TableHead>Price</TableHead>
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
									<TableCell className="text-right flex gap-2 justify-end">
										<Button
											size="icon"
											variant="ghost"
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
											onClick={() => remove(room._id)}
										>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</PageContainer>
	);
}
