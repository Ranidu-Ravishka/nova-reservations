"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import type { Room, RoomType } from "@/types/room";

type Hotel = {
	_id: string;
	name: string;
};

const schema = z.object({
	name: z.string().min(2, "Room name is required"),
	type: z.enum(["DELUXE", "PREMIUM", "PRESIDENTIAL", "SUITE"]),
	description: z.string().optional(),
	hotelId: z.string().min(1, "Hotel is required"),
	totalRooms: z.coerce.number().int().min(1, "Total rooms must be at least 1"),
	capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
	size: z.string().optional(),
	pricePerNight: z.coerce.number().min(0, "Price must be 0 or more"),
	amenities: z.string().optional(),
	heroImage: z.string().optional(),
	listingImage: z.string().optional(),
	galleryImages: z.string().optional(),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

export default function RoomForm({
	room,
	onSuccess,
}: {
	room?: Room;
	onSuccess: () => void;
}) {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [hotelsLoading, setHotelsLoading] = useState(true);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: room?.name ?? "",
			type: (room?.type ?? "DELUXE") as RoomType,
			description: room?.description ?? "",
			hotelId:
				typeof room?.hotelId === "string"
					? room.hotelId
					: (room?.hotelId?._id ?? ""),
			totalRooms: room?.totalRooms ?? 1,
			capacity: room?.capacity ?? 1,
			size: room?.size ?? "",
			pricePerNight: room?.pricePerNight ?? 0,
			amenities: room?.amenities?.join(", ") ?? "",
			heroImage: room?.images?.hero ?? "",
			listingImage: room?.images?.listing ?? "",
			galleryImages: room?.images?.gallery?.join("\n") ?? "",
		},
	});

	useEffect(() => {
		reset({
			name: room?.name ?? "",
			type: (room?.type ?? "DELUXE") as RoomType,
			description: room?.description ?? "",
			hotelId:
				typeof room?.hotelId === "string"
					? room.hotelId
					: (room?.hotelId?._id ?? ""),
			totalRooms: room?.totalRooms ?? 1,
			capacity: room?.capacity ?? 1,
			size: room?.size ?? "",
			pricePerNight: room?.pricePerNight ?? 0,
			amenities: room?.amenities?.join(", ") ?? "",
			heroImage: room?.images?.hero ?? "",
			listingImage: room?.images?.listing ?? "",
			galleryImages: room?.images?.gallery?.join("\n") ?? "",
		});
	}, [room, reset]);

	/* ---------------- LOAD HOTELS ---------------- */

	useEffect(() => {
		setHotelsLoading(true);
		api
			.get("/hotels")
			.then((res) => setHotels(res.data))
			.catch((err: unknown) => {
				toast.error(getErrorMessage(err, "Failed to load hotels"));
			})
			.finally(() => setHotelsLoading(false));
	}, []);

	/* ---------------- SUBMIT ---------------- */

	const submit = async (values: FormOutput) => {
		const payload = {
			name: values.name,
			type: values.type,
			description: values.description || "",
			hotelId: values.hotelId,
			totalRooms: values.totalRooms,
			capacity: values.capacity,
			size: values.size || "",
			pricePerNight: values.pricePerNight,
			amenities: (values.amenities || "")
				.split(",")
				.map((a: string) => a.trim())
				.filter(Boolean),
			images: {
				hero: values.heroImage || undefined,
				listing: values.listingImage || undefined,
				gallery: (values.galleryImages || "")
					.split("\n")
					.map((g: string) => g.trim())
					.filter(Boolean),
			},
		};

		try {
			if (room?._id) {
				await api.put(`/rooms/${room._id}`, payload);
				toast.success("Room updated");
			} else {
				await api.post("/rooms", payload);
				toast.success("Room created");
			}

			onSuccess();
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to save room"));
		}
	};

	return (
		<form onSubmit={handleSubmit(submit)} className="space-y-4">
			<div className="space-y-2">
				<Label>Room name</Label>
				<Input placeholder="Room name" {...register("name")} />
				{errors.name ? (
					<p className="text-sm text-destructive">{errors.name.message}</p>
				) : null}
			</div>

			{/* ROOM TYPE */}
			<div className="space-y-2">
				<Label>Room type</Label>
				<Select
					value={watch("type")}
					onValueChange={(value: RoomType) => setValue("type", value)}
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
			</div>

			<div className="space-y-2">
				<Label>Description</Label>
				<Textarea placeholder="Description" {...register("description")} />
			</div>

			{/* HOTEL */}
			<div className="space-y-2">
				<Label>Hotel</Label>
				<Select
					value={watch("hotelId")}
					onValueChange={(value) => setValue("hotelId", value)}
					disabled={hotelsLoading}
				>
					<SelectTrigger>
						<SelectValue
							placeholder={hotelsLoading ? "Loading…" : "Select hotel"}
						/>
					</SelectTrigger>
					<SelectContent>
						{hotels.map((h) => (
							<SelectItem key={h._id} value={h._id}>
								{h.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.hotelId ? (
					<p className="text-sm text-destructive">{errors.hotelId.message}</p>
				) : null}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Total rooms</Label>
					<Input type="number" {...register("totalRooms")} />
					{errors.totalRooms ? (
						<p className="text-sm text-destructive">
							{errors.totalRooms.message}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<Label>Capacity</Label>
					<Input type="number" {...register("capacity")} />
					{errors.capacity ? (
						<p className="text-sm text-destructive">
							{errors.capacity.message}
						</p>
					) : null}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Price per night</Label>
					<Input type="number" {...register("pricePerNight")} />
					{errors.pricePerNight ? (
						<p className="text-sm text-destructive">
							{errors.pricePerNight.message}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<Label>Size</Label>
					<Input placeholder="e.g. 40 m²" {...register("size")} />
				</div>
			</div>

			<div className="space-y-2">
				<Label>Amenities (comma separated)</Label>
				<Input placeholder="WiFi, TV, Mini bar" {...register("amenities")} />
			</div>

			<div className="space-y-2">
				<Label>Hero image URL</Label>
				<Input placeholder="https://…" {...register("heroImage")} />
			</div>

			<div className="space-y-2">
				<Label>Listing image URL</Label>
				<Input placeholder="https://…" {...register("listingImage")} />
			</div>

			<div className="space-y-2">
				<Label>Gallery images (one per line)</Label>
				<Textarea
					placeholder="https://…\nhttps://…"
					{...register("galleryImages")}
				/>
			</div>

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Saving…
					</>
				) : (
					"Save Room"
				)}
			</Button>
		</form>
	);
}
