"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import RoomForm from "./RoomForm";

type Hotel = { _id: string; name: string };
type Room = {
	_id: string;
	name: string;
	size?: string;
	hotelId?: Hotel | null;
	pricePerNight: number;
	occupancy: number;
};

export default function RoomsPage() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);

	const fetchRooms = useCallback(async () => {
		const res = await axios.get("http://localhost:4000/api/rooms");
		setRooms(res.data);
	}, []);

	useEffect(() => {
		fetchRooms();
	}, [fetchRooms]);

	return (
		<>
			<div className="flex justify-between mb-6">
				<h2 className="text-xl font-semibold">Rooms</h2>
				<Button
					onClick={() => {
						setSelectedRoom(undefined);
						setOpen(true);
					}}
				>
					Add Room
				</Button>
			</div>

			<div className="rounded-xl overflow-hidden border border-white/10">
				<table className="w-full">
					<thead className="bg-white/5">
						<tr>
							<th className="p-3 text-left">Room</th>
							<th className="p-3">Hotel</th>
							<th className="p-3">Price</th>
							<th className="p-3">Occupancy</th>
							<th className="p-3">Actions</th>
						</tr>
					</thead>
					<tbody>
						{rooms.map((room) => (
							<tr
								key={room._id}
								className="border-t border-white/10 hover:bg-white/5"
							>
								<td className="p-3">
									<p className="font-medium">{room.name}</p>
									<p className="text-sm text-gray-400">{room.size}</p>
								</td>

								<td className="p-3 text-center">
									<Badge variant="outline">{room.hotelId?.name || "—"}</Badge>
								</td>

								<td className="p-3 text-center">${room.pricePerNight}</td>

								<td className="p-3 text-center">{room.occupancy} Guests</td>

								<td className="p-3 flex justify-center gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											setSelectedRoom(room);
											setOpen(true);
										}}
									>
										Edit
									</Button>
									<Button
										size="sm"
										variant="destructive"
										onClick={async () => {
											await axios.delete(
												`http://localhost:4000/api/rooms/${room._id}`,
											);
											fetchRooms();
										}}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<RoomForm
					room={
						selectedRoom
							? {
									...selectedRoom,
									size: selectedRoom.size ?? "",
									hotelId: selectedRoom.hotelId
										? { _id: selectedRoom.hotelId._id }
										: undefined,
								}
							: undefined
					}
					onSuccess={() => {
						setOpen(false);
						fetchRooms();
					}}
				/>
			</Dialog>
		</>
	);
}
