"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { Room, RoomType } from "@/types/room";

type Hotel = {
	_id: string;
	name: string;
};

/* ---------------- FORM STATE TYPE ---------------- */

type RoomFormState = {
	name: string;
	type: RoomType;
	description: string;
	hotelId: string;
	totalRooms: string;
	capacity: string;
	size: string;
	pricePerNight: string;
	amenities: string;
	heroImage: string;
	listingImage: string;
	galleryImages: string;
};

export default function RoomForm({
	room,
	onSuccess,
}: {
	room?: Room;
	onSuccess: () => void;
}) {
	const [hotels, setHotels] = useState<Hotel[]>([]);

	/* ---------------- FORM STATE ---------------- */

	const [form, setForm] = useState<RoomFormState>({
		name: room?.name ?? "",
		type: room?.type ?? "DELUXE",
		description: room?.description ?? "",
		hotelId:
			typeof room?.hotelId === "string"
				? room.hotelId
				: (room?.hotelId?._id ?? ""),
		totalRooms: room?.totalRooms?.toString() ?? "1",
		capacity: room?.capacity?.toString() ?? "1",
		size: room?.size ?? "",
		pricePerNight: room?.pricePerNight?.toString() ?? "",
		amenities: room?.amenities?.join(", ") ?? "",
		heroImage: room?.images?.hero ?? "",
		listingImage: room?.images?.listing ?? "",
		galleryImages: room?.images?.gallery?.join("\n") ?? "",
	});

	/* ---------------- LOAD HOTELS ---------------- */

	useEffect(() => {
		api.get("/hotels").then((res) => setHotels(res.data));
	}, []);

	/* ---------------- INPUT HANDLER ---------------- */

	const onInput =
		(key: keyof RoomFormState) =>
		(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			setForm({ ...form, [key]: e.target.value });
		};

	/* ---------------- SUBMIT ---------------- */

	const submit = async () => {
		const payload = {
			name: form.name,
			type: form.type,
			description: form.description,
			hotelId: form.hotelId,
			totalRooms: Number(form.totalRooms),
			capacity: Number(form.capacity),
			size: form.size,
			pricePerNight: Number(form.pricePerNight),
			amenities: form.amenities
				.split(",")
				.map((a: string) => a.trim())
				.filter(Boolean),
			images: {
				hero: form.heroImage || undefined,
				listing: form.listingImage || undefined,
				gallery: form.galleryImages
					.split("\n")
					.map((g: string) => g.trim())
					.filter(Boolean),
			},
		};

		if (room?._id) {
			await api.put(`/rooms/${room._id}`, payload);
		} else {
			await api.post("/rooms", payload);
		}

		onSuccess();
	};

	return (
		<div className="space-y-4">
			<Input
				placeholder="Room name"
				value={form.name}
				onChange={onInput("name")}
			/>

			{/* ROOM TYPE */}
			<Select
				value={form.type}
				onValueChange={(value: RoomType) => setForm({ ...form, type: value })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Room type" />
				</SelectTrigger>
				<SelectContent>
					{["DELUXE", "PREMIUM", "PRESIDENTIAL", "SUITE"].map((t) => (
						<SelectItem key={t} value={t}>
							{t}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Textarea
				placeholder="Description"
				value={form.description}
				onChange={onInput("description")}
			/>

			{/* HOTEL */}
			<Select
				value={form.hotelId}
				onValueChange={(value) => setForm({ ...form, hotelId: value })}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select hotel" />
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
				placeholder="Total rooms"
				value={form.totalRooms}
				onChange={onInput("totalRooms")}
			/>

			<Input
				type="number"
				placeholder="Capacity per room"
				value={form.capacity}
				onChange={onInput("capacity")}
			/>

			<Input
				type="number"
				placeholder="Price per night"
				value={form.pricePerNight}
				onChange={onInput("pricePerNight")}
			/>

			<Input
				placeholder="Size (e.g. 40 m²)"
				value={form.size}
				onChange={onInput("size")}
			/>

			<Input
				placeholder="Hero image URL"
				value={form.heroImage}
				onChange={onInput("heroImage")}
			/>

			<Input
				placeholder="Listing image URL"
				value={form.listingImage}
				onChange={onInput("listingImage")}
			/>

			<Textarea
				placeholder="Gallery images (one per line)"
				value={form.galleryImages}
				onChange={onInput("galleryImages")}
			/>

			<Button onClick={submit}>Save Room</Button>
		</div>
	);
}
