"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type Hotel = { _id: string; name: string };

type Room = {
	_id: string;
	name: string;
	hotelId?: string | { _id: string };
	pricePerNight: number;
	size: string;
	occupancy: number;
};

type FormState = {
	name: string;
	hotelId: string;
	pricePerNight: string;
	size: string;
	occupancy: string;
};

export default function RoomForm({
	room,
	onSuccess,
}: {
	room?: Room;
	onSuccess: () => void;
}) {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [form, setForm] = useState<FormState>({
		name: "",
		hotelId: "",
		pricePerNight: "",
		size: "",
		occupancy: "",
	});

	useEffect(() => {
		axios.get<Hotel[]>("http://localhost:5000/api/hotels").then((res) => {
			setHotels(res.data);
		});

		if (room) {
			setForm({
				name: room.name,
				hotelId:
					typeof room.hotelId === "string"
						? room.hotelId
						: (room.hotelId?._id ?? ""),
				pricePerNight: String(room.pricePerNight),
				size: room.size,
				occupancy: String(room.occupancy),
			});
		}
	}, [room]);

	const submit = async () => {
		const payload = {
			...form,
			pricePerNight: Number(form.pricePerNight),
			occupancy: Number(form.occupancy),
		};

		if (room) {
			await axios.put(`http://localhost:5000/api/rooms/${room._id}`, payload);
		} else {
			await axios.post("http://localhost:5000/api/rooms", payload);
		}

		onSuccess();
	};

	return (
		<DialogContent className="bg-black text-white rounded-xl max-w-lg">
			<h3 className="text-lg font-semibold mb-4">
				{room ? "Edit Room" : "Add Room"}
			</h3>

			<div className="space-y-4">
				<Input
					placeholder="Room Name"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>

				<Select
					value={form.hotelId}
					onValueChange={(value: string) =>
						setForm({ ...form, hotelId: value })
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select Hotel" />
					</SelectTrigger>
					{hotels.map((hotel) => (
						<SelectItem key={hotel._id} value={hotel._id}>
							{hotel.name}
						</SelectItem>
					))}
				</Select>

				<Input
					placeholder="Price per night"
					type="number"
					value={form.pricePerNight}
					onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
				/>

				<Input
					placeholder="Room Size (e.g. 40m²)"
					value={form.size}
					onChange={(e) => setForm({ ...form, size: e.target.value })}
				/>

				<Input
					placeholder="Occupancy"
					type="number"
					value={form.occupancy}
					onChange={(e) => setForm({ ...form, occupancy: e.target.value })}
				/>

				<Button className="w-full" onClick={submit}>
					Save Room
				</Button>
			</div>
		</DialogContent>
	);
}
