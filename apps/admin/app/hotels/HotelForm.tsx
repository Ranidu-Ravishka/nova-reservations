"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
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

/* ---------------- COMPONENT ---------------- */

export default function HotelForm({ onSuccess, editingHotel }: HotelFormProps) {
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		name: editingHotel?.name ?? "",
		location: editingHotel?.location ?? "Colombo",
		description: editingHotel?.description ?? "",
		amenities: editingHotel?.amenities?.join(", ") ?? "",
		images: editingHotel?.images?.join(", ") ?? "",
		lat: editingHotel?.coordinates?.lat?.toString() ?? "",
		lng: editingHotel?.coordinates?.lng?.toString() ?? "",
	});

	/* ---------------- SUBMIT ---------------- */

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form.name || !form.location || !form.lat || !form.lng) {
			alert("Name, location, latitude and longitude are required");
			return;
		}

		setLoading(true);

		const payload = {
			name: form.name.trim(),
			location: form.location,
			description: form.description.trim(),
			amenities: form.amenities
				.split(",")
				.map((a) => a.trim())
				.filter(Boolean),

			// ✅ FIX: images is now string[]
			images: form.images
				.split(",")
				.map((i) => i.trim())
				.filter(Boolean),

			coordinates: {
				lat: Number(form.lat),
				lng: Number(form.lng),
			},
		};

		try {
			if (editingHotel) {
				await api.put(`/hotels/${editingHotel._id}`, payload);
			} else {
				await api.post("/hotels", payload);
			}

			onSuccess();
		} catch (err: unknown) {
			if (typeof err === "object" && err !== null && "response" in err) {
				// @ts-expect-error axios error shape
				alert(err.response?.data?.message || "Failed to save hotel");
			} else {
				alert("Failed to save hotel");
			}
		} finally {
			setLoading(false);
		}
	};

	/* ---------------- UI ---------------- */

	return (
		<form onSubmit={submit} className="space-y-4">
			<div>
				<Label>Hotel Name *</Label>
				<Input
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>
			</div>

			<div>
				<Label>Location *</Label>
				<Select
					value={form.location}
					onValueChange={(value) => setForm({ ...form, location: value })}
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
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<Label>Latitude *</Label>
					<Input
						type="number"
						step="any"
						value={form.lat}
						onChange={(e) => setForm({ ...form, lat: e.target.value })}
					/>
				</div>

				<div>
					<Label>Longitude *</Label>
					<Input
						type="number"
						step="any"
						value={form.lng}
						onChange={(e) => setForm({ ...form, lng: e.target.value })}
					/>
				</div>
			</div>

			<div>
				<Label>Description</Label>
				<Textarea
					value={form.description}
					onChange={(e) => setForm({ ...form, description: e.target.value })}
				/>
			</div>

			<div>
				<Label>Amenities (comma separated)</Label>
				<Input
					placeholder="Pool, Spa, Gym"
					value={form.amenities}
					onChange={(e) => setForm({ ...form, amenities: e.target.value })}
				/>
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
					value={form.images}
					onChange={(e) => setForm({ ...form, images: e.target.value })}
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
