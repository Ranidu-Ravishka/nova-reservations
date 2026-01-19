"use client";

import { Edit2, Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
	phone?: string;
	category?: string;
	createdAt?: string;
};

export default function HotelsPage() {
	const [hotels, setHotels] = useState<Hotel[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		api.get("/hotels").then((res) => {
			setHotels(res.data);
			setLoading(false);
		});
	}, []);

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
		<div className="p-4 md:p-6 max-w-6xl mx-auto">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-semibold">Hotels</h1>
					<p className="text-sm text-muted-foreground">
						Manage hotel properties
					</p>
				</div>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Hotel
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-lg">
						<HotelForm
							editingHotel={editingHotel}
							onSuccess={() => {
								setDialogOpen(false);
								setEditingHotel(null);
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* Search */}
			<div className="mb-4">
				<div className="relative max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search hotels..."
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* Table */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">
						{filteredHotels.length} Hotels
					</CardTitle>
				</CardHeader>

				<CardContent className="overflow-x-auto">
					{loading ? (
						<p className="text-sm text-muted-foreground">Loading...</p>
					) : filteredHotels.length === 0 ? (
						<p className="text-sm text-muted-foreground">No hotels found.</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead className="hidden md:table-cell">
										Location
									</TableHead>
									<TableHead className="hidden sm:table-cell">
										Category
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredHotels.map((hotel) => (
									<TableRow key={hotel._id}>
										<TableCell>
											<div className="font-medium">{hotel.name}</div>
											<div className="text-xs text-muted-foreground flex items-center gap-1 md:hidden">
												<MapPin className="h-3 w-3" />
												{hotel.location}
											</div>
										</TableCell>

										<TableCell className="hidden md:table-cell">
											{hotel.location}
										</TableCell>

										<TableCell className="hidden sm:table-cell">
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
														setDialogOpen(true);
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
