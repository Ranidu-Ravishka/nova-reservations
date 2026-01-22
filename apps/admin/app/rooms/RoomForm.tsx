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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

type Hotel = {
	_id: string;
	name: string;
};

type RoomHotelRef = {
	_id: string;
	name?: string;
};

type Room = {
	_id: string;
	name?: string;
	description?: string;
	hotelId?: string | RoomHotelRef;
	pricePerNight?: number;
	occupancy?: number;
	size?: string;
	images?: {
		hero?: string;
		listing?: string;
		gallery?: string[];
	};
};

export default function RoomForm({
	room,
	onSuccess,
}: {
	room?: Room;
	onSuccess: () => void;
}) {
	const [hotels, setHotels] = useState<Hotel[]>([]);

	const initialHotelId =
		typeof room?.hotelId === "string"
			? room.hotelId
			: (room?.hotelId?._id ?? "");

	const [form, setForm] = useState({
		name: room?.name ?? "",
		description: room?.description ?? "",
		hotelId: initialHotelId,
		pricePerNight: room?.pricePerNight ?? "",
		occupancy: room?.occupancy ?? "",
		size: room?.size ?? "",

		heroImage: room?.images?.hero ?? "",
		listingImage: room?.images?.listing ?? "",
		galleryImages: room?.images?.gallery?.join("\n") ?? "",
	});

	useEffect(() => {
		api.get("/hotels").then((res) => setHotels(res.data));
	}, []);

	const submit = async () => {
		const payload = {
			name: form.name,
			description: form.description,
			hotelId: form.hotelId,
			pricePerNight: Number(form.pricePerNight),
			occupancy: Number(form.occupancy),
			size: form.size,

			images: {
				hero: form.heroImage || undefined,
				listing: form.listingImage || undefined,
				gallery: form.galleryImages
					.split("\n")
					.map((i: string) => i.trim())
					.filter(Boolean),
			},
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

			<Textarea
				placeholder="Room description"
				value={form.description}
				onChange={(e) => setForm({ ...form, description: e.target.value })}
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

			<Input
				type="number"
				placeholder="Max guests"
				value={form.occupancy}
				onChange={(e) => setForm({ ...form, occupancy: e.target.value })}
			/>

			<Input
				placeholder="Room size (e.g. 450 sqft)"
				value={form.size}
				onChange={(e) => setForm({ ...form, size: e.target.value })}
			/>

			{/* IMAGE FIELDS */}
			<Input
				placeholder="Hero image path (used on room page top)"
				value={form.heroImage}
				onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
			/>

			<Input
				placeholder="Listing image path (used on cards)"
				value={form.listingImage}
				onChange={(e) => setForm({ ...form, listingImage: e.target.value })}
			/>

			<Textarea
				placeholder={`Gallery images (one per line)
Example:
/rooms/colombo/deluxe-1.jpg
/rooms/colombo/deluxe-2.jpg`}
				value={form.galleryImages}
				onChange={(e) => setForm({ ...form, galleryImages: e.target.value })}
			/>

			<Button onClick={submit} className="w-full">
				Save Room
			</Button>
		</div>
	);
}
