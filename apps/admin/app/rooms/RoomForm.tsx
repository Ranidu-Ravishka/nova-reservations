"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

type Hotel = { _id: string; name: string };

export default function RoomForm({
	room,
	onSuccess,
}: {
	room?: any;
	onSuccess: () => void;
}) {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [form, setForm] = useState({
		name: room?.name || "",
		hotelId: room?.hotelId?._id || "",
		pricePerNight: room?.pricePerNight || "",
	});

	useEffect(() => {
		api.get("/hotels").then((res) => setHotels(res.data));
	}, []);

	const submit = async () => {
		const payload = {
			...form,
			pricePerNight: Number(form.pricePerNight),
		};

		if (room) {
			await api.put(`/rooms/${room._id}`, payload);
		} else {
			await api.post("/rooms", payload);
		}
		onSuccess();
	};

	return (
		<div className="space-y-4">
			<DialogTitle>{room ? "Edit Room" : "Add Room"}</DialogTitle>

			<Input
				placeholder="Room Name"
				value={form.name}
				onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>

			<Select
				value={form.hotelId}
				onValueChange={(v) => setForm({ ...form, hotelId: v })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select Hotel" />
				</SelectTrigger>
				<SelectContent>
					{hotels.map((h) => (
						<SelectItem key={h._id} value={h._id}>
							{h.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Input
				type="number"
				placeholder="Price per night"
				value={form.pricePerNight}
				onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
			/>

			<Button onClick={submit} className="w-full">
				Save Room
			</Button>
		</div>
	);
}
