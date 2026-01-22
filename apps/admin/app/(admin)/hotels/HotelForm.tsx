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

/* ---------------- TYPES ---------------- */

interface Coordinates {
	lat: number;
	lng: number;
}

interface EditingHotel {
	_id: string;
	name: string;
	location: string;
	description?: string;
	amenities?: string[];
	images?: string[];
	coordinates?: Coordinates;
}

interface HotelFormProps {
	onSuccess: () => void;
	editingHotel?: EditingHotel | null;
}

const LOCATIONS = ["Colombo", "Kandy", "Galle", "Nuwara Eliya"];

const schema = z.object({
	name: z.string().min(2, "Hotel name is required"),
	location: z.string().min(1, "Location is required"),
	description: z.string().optional(),
	amenities: z.string().optional(),
	images: z.string().optional(),
	lat: z.coerce
		.number({ message: "Latitude is required" })
		.min(-90, "Latitude must be ≥ -90")
		.max(90, "Latitude must be ≤ 90"),
	lng: z.coerce
		.number({ message: "Longitude is required" })
		.min(-180, "Longitude must be ≥ -180")
		.max(180, "Longitude must be ≤ 180"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

/* ---------------- COMPONENT ---------------- */

export default function HotelForm({ onSuccess, editingHotel }: HotelFormProps) {
	const [loading, setLoading] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: editingHotel?.name ?? "",
			location: editingHotel?.location ?? "Colombo",
			description: editingHotel?.description ?? "",
			amenities: editingHotel?.amenities?.join(", ") ?? "",
			images: editingHotel?.images?.join(", ") ?? "",
			lat: editingHotel?.coordinates?.lat ?? 0,
			lng: editingHotel?.coordinates?.lng ?? 0,
		},
	});

	useEffect(() => {
		reset({
			name: editingHotel?.name ?? "",
			location: editingHotel?.location ?? "Colombo",
			description: editingHotel?.description ?? "",
			amenities: editingHotel?.amenities?.join(", ") ?? "",
			images: editingHotel?.images?.join(", ") ?? "",
			lat: editingHotel?.coordinates?.lat ?? 0,
			lng: editingHotel?.coordinates?.lng ?? 0,
		});
	}, [editingHotel, reset]);

	/* ---------------- SUBMIT ---------------- */

	const submit = async (values: FormOutput) => {
		setLoading(true);

		const payload = {
			name: values.name.trim(),
			location: values.location,
			description: values.description?.trim() || "",
			amenities: (values.amenities || "")
				.split(",")
				.map((a) => a.trim())
				.filter(Boolean),
			images: (values.images || "")
				.split(",")
				.map((i) => i.trim())
				.filter(Boolean),
			coordinates: {
				lat: values.lat,
				lng: values.lng,
			},
		};

		try {
			if (editingHotel) {
				await api.put(`/hotels/${editingHotel._id}`, payload);
				toast.success("Hotel updated");
			} else {
				await api.post("/hotels", payload);
				toast.success("Hotel created");
			}

			onSuccess();
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to save hotel"));
		} finally {
			setLoading(false);
		}
	};

	/* ---------------- UI ---------------- */

	return (
		<form onSubmit={handleSubmit(submit)} className="space-y-4">
			<div>
				<Label>Hotel Name *</Label>
				<Input {...register("name")} />
				{errors.name ? (
					<p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
				) : null}
			</div>

			<div>
				<Label>Location *</Label>
				<Select
					value={watch("location")}
					onValueChange={(value) => setValue("location", value)}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LOCATIONS.map((loc) => (
							<SelectItem key={loc} value={loc}>
								{loc}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.location ? (
					<p className="mt-1 text-sm text-destructive">
						{errors.location.message}
					</p>
				) : null}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label>Latitude *</Label>
					<Input type="number" step="any" {...register("lat")} />
					{errors.lat ? (
						<p className="mt-1 text-sm text-destructive">
							{errors.lat.message}
						</p>
					) : null}
				</div>

				<div>
					<Label>Longitude *</Label>
					<Input type="number" step="any" {...register("lng")} />
					{errors.lng ? (
						<p className="mt-1 text-sm text-destructive">
							{errors.lng.message}
						</p>
					) : null}
				</div>
			</div>

			<div>
				<Label>Description</Label>
				<Textarea {...register("description")} />
			</div>

			<div>
				<Label>Amenities (comma separated)</Label>
				<Input placeholder="Pool, Spa, Gym" {...register("amenities")} />
			</div>

			<div>
				<Label>Images (ordered, comma separated)</Label>

				<p className="text-xs text-muted-foreground mb-2 leading-relaxed">
					Image order matters:
					<br />
					<strong>1st</strong> → Hero image
					<br />
					<strong>2nd</strong> → Hotel card image
					<br />
					<strong>3rd+</strong> → Gallery images
					<br />
					<br />
					Example:
					<br />
					<code className="block mt-1 text-xs">
						/hotels/colombo/hero.jpg, /hotels/colombo/card.jpg,
						/hotels/colombo/gallery-1.jpg
					</code>
				</p>

				<Input
					placeholder="/hotels/colombo/hero.jpg, /hotels/colombo/card.jpg, /hotels/colombo/gallery-1.jpg"
					{...register("images")}
				/>
			</div>

			<Button type="submit" disabled={loading} className="w-full">
				{loading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Saving...
					</>
				) : editingHotel ? (
					"Update Hotel"
				) : (
					"Add Hotel"
				)}
			</Button>
		</form>
	);
}
