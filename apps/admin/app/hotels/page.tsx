"use client";

import { Edit2, Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import HotelForm from "./HotelForm";

type Hotel = {
	_id: string;
	name: string;
	location: string;
	description?: string;
	category?: string;
};

export default function HotelsPage() {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(false);
	const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const loadHotels = useCallback(async () => {
		const res = await api.get<Hotel[]>("/hotels");
		setHotels(res.data);
		setLoading(false);
	}, []);

	useEffect(() => {
		loadHotels();
	}, [loadHotels]);

	const filteredHotels = hotels.filter(
		(h) =>
			h.name.toLowerCase().includes(search.toLowerCase()) ||
			h.location.toLowerCase().includes(search.toLowerCase()),
	);

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this hotel?")) return;
		setDeletingId(id);
		await api.delete(`/hotels/${id}`);
		setHotels((prev) => prev.filter((h) => h._id !== id));
		setDeletingId(null);
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			{/* Header */}
			<div className="flex justify-between mb-6">
				<div>
					<h1 className="text-2xl font-semibold">Hotels</h1>
					<p className="text-sm text-muted-foreground">
						Manage hotel properties
					</p>
				</div>

				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Hotel
						</Button>
					</DialogTrigger>

					<DialogContent className="max-w-xl">
						<DialogTitle className="sr-only">Hotel Form</DialogTitle>
						<DialogDescription className="sr-only">
							Create or edit a hotel
						</DialogDescription>

						<HotelForm
							editingHotel={editingHotel}
							onSuccess={() => {
								setOpen(false);
								setEditingHotel(null);
								loadHotels();
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search */}
			<div className="mb-4 max-w-sm relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search hotels..."
					className="pl-9"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			{/* Table */}
			<Card>
				<CardHeader>
					<CardTitle>{filteredHotels.length} Hotels</CardTitle>
				</CardHeader>

				<CardContent>
					{loading ? (
						<p>Loading...</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>Category</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{filteredHotels.map((hotel) => (
									<TableRow key={hotel._id}>
										<TableCell className="font-medium">{hotel.name}</TableCell>

										<TableCell className="flex items-center gap-1">
											<MapPin className="h-3 w-3" />
											{hotel.location}
										</TableCell>

										<TableCell>
											<Badge variant="outline">
												{hotel.category || "General"}
											</Badge>
										</TableCell>

										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													size="icon"
													variant="ghost"
													onClick={() => {
														setEditingHotel(hotel);
														setOpen(true);
													}}
												>
													<Edit2 className="h-4 w-4" />
												</Button>

												<Button
													size="icon"
													variant="ghost"
													disabled={deletingId === hotel._id}
													onClick={() => handleDelete(hotel._id)}
												>
													{deletingId === hotel._id ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Trash2 className="h-4 w-4 text-red-500" />
													)}
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
