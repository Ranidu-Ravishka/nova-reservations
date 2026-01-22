"use client";

import { Edit2, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
import type { Room } from "@/types/room";
import RoomForm from "./RoomForm";

export default function RoomsPage() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [availabilityFilter, setAvailabilityFilter] = useState<
		"all" | "available" | "unavailable"
	>("all");

	const loadRooms = useCallback(async () => {
		const res = await api.get("/rooms");
		setRooms(res.data);
		setLoading(false);
	}, []);

	useEffect(() => {
		loadRooms();
	}, [loadRooms]);

	const remove = async (id: string) => {
		if (!confirm("Delete this room?")) return;
		await api.delete(`/rooms/${id}`);
		setRooms((prev) => prev.filter((r) => r._id !== id));
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="flex justify-between mb-6">
				<h1 className="text-2xl font-semibold">Rooms</h1>

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
			</div>

			{/* Search & Filters */}
			<div className="flex items-center gap-3 mb-4">
				<div className="relative max-w-sm w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search rooms..."
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
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

			{loading ? (
				<Loader2 className="animate-spin" />
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
						{rooms
							.filter((r) => {
								const matchesSearch = r.name
									.toLowerCase()
									.includes(search.toLowerCase());
								const matchesAvailability =
									availabilityFilter === "all" ||
									(availabilityFilter === "available" && r.isAvailable) ||
									(availabilityFilter === "unavailable" &&
										r.isAvailable === false);
								return matchesSearch && matchesAvailability;
							})
							.map((room) => (
								<TableRow key={room._id}>
									<TableCell>{room.name}</TableCell>
									<TableCell>
										{typeof room.hotelId === "string" ? "-" : room.hotelId.name}
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
	);
}
