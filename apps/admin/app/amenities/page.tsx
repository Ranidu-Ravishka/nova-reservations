"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type AmenityStatus = "ACTIVE" | "INACTIVE";

type Amenity = {
	id: string;
	name: string;
	category: string;
	hotel: string;
	status: AmenityStatus;
};

type AmenityForm = Pick<Amenity, "name" | "category" | "hotel">;

const emptyForm: AmenityForm = { name: "", category: "", hotel: "" };

// Dummy amenities data (replace with API)
const initialAmenities: Amenity[] = [
	{
		id: "AM-001",
		name: "Swimming Pool",
		category: "Hotel",
		hotel: "Nova Colombo",
		status: "ACTIVE",
	},
	{
		id: "AM-002",
		name: "Free Wi-Fi",
		category: "Room",
		hotel: "All Hotels",
		status: "ACTIVE",
	},
	{
		id: "AM-003",
		name: "Airport Pickup",
		category: "Transport",
		hotel: "Nova Galle",
		status: "INACTIVE",
	},
];

export default function AmenitiesManagementPage() {
	const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
	const [selected, setSelected] = useState<Amenity | null>(null);
	const [form, setForm] = useState<AmenityForm>(emptyForm);

	const saveAmenity = () => {
		if (selected?.id) {
			setAmenities((prev) =>
				prev.map((a) => (a.id === selected.id ? { ...a, ...form } : a)),
			);
		} else {
			setAmenities((prev) => [
				...prev,
				{
					id: `AM-${String(prev.length + 1).padStart(3, "0")}`,
					...form,
					status: "ACTIVE",
				},
			]);
		}
		setSelected(null);
		setForm(emptyForm);
	};

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Amenities Management</CardTitle>
					<Button
						onClick={() => {
							setSelected({
								id: "",
								...emptyForm,
								status: "ACTIVE",
							});
							setForm(emptyForm);
						}}
					>
						Add Amenity
					</Button>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Hotel</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{amenities.map((a) => (
								<TableRow key={a.id}>
									<TableCell>{a.id}</TableCell>
									<TableCell>{a.name}</TableCell>
									<TableCell>
										<Badge variant="secondary">{a.category}</Badge>
									</TableCell>
									<TableCell>{a.hotel}</TableCell>
									<TableCell>
										<Badge
											variant={a.status === "ACTIVE" ? "default" : "outline"}
										>
											{a.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setSelected(a);
												setForm({
													name: a.name,
													category: a.category,
													hotel: a.hotel,
												});
											}}
										>
											Edit
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() =>
												setAmenities((prev) =>
													prev.filter((x) => x.id !== a.id),
												)
											}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog
				open={!!selected}
				onOpenChange={(open) => {
					if (!open) setSelected(null);
				}}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{selected?.id ? "Edit Amenity" : "Add Amenity"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							placeholder="Amenity Name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
						<Select
							value={form.category}
							onValueChange={(value) => setForm({ ...form, category: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Hotel">Hotel</SelectItem>
								<SelectItem value="Room">Room</SelectItem>
								<SelectItem value="Transport">Transport</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={form.hotel}
							onValueChange={(value) => setForm({ ...form, hotel: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Assign Hotel" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All Hotels">All Hotels</SelectItem>
								<SelectItem value="Nova Colombo">Nova Colombo</SelectItem>
								<SelectItem value="Nova Kandy">Nova Kandy</SelectItem>
								<SelectItem value="Nova Galle">Nova Galle</SelectItem>
								<SelectItem value="Nova Nuwara Eliya">
									Nova Nuwara Eliya
								</SelectItem>
							</SelectContent>
						</Select>
						<Button className="w-full" onClick={saveAmenity}>
							Save Amenity
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
