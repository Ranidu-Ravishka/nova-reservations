"use client";

import { Edit2, Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
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
import { getErrorMessage } from "@/lib/errors";
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
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(false);
	const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const loadHotels = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get<Hotel[]>("/hotels");
			setHotels(res.data);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Failed to load hotels"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadHotels();
	}, [loadHotels]);

	const filteredHotels = hotels.filter(
		(h) =>
			h.name.toLowerCase().includes(search.toLowerCase()) ||
			h.location.toLowerCase().includes(search.toLowerCase()),
	);

	const locationCount = new Set(hotels.map((hotel) => hotel.location)).size;

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this hotel?")) return;
		setDeletingId(id);
		try {
			await api.delete(`/hotels/${id}`);
			setHotels((prev) => prev.filter((h) => h._id !== id));
			toast.success("Hotel deleted");
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to delete hotel"));
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<PageContainer>
			<PageHeader
				title="Hotels"
				description="Manage hotel properties"
				actions={
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Add Hotel
							</Button>
						</DialogTrigger>

						<DialogContent className="max-w-xl luxury-panel border-white/10">
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
				}
			/>

			{/* Summary */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Total Hotels
						</p>
						<p className="text-3xl font-display mt-2">{hotels.length}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Destinations
						</p>
						<p className="text-3xl font-display mt-2">{locationCount}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Search Results
						</p>
						<p className="text-3xl font-display mt-2">
							{filteredHotels.length}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Search */}
			<div className="max-w-md relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search hotels..."
					className="pl-9 bg-white/5 border-white/10"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>

			<div className="mt-4">
				{error ? (
					<EmptyState
						title="Couldn’t load hotels"
						description={error}
						action={<RetryButton onClick={loadHotels} />}
					/>
				) : loading ? (
					<Card className="luxury-card">
						<CardHeader>
							<CardTitle>Loading…</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span className="text-sm">Fetching hotels</span>
							</div>
						</CardContent>
					</Card>
				) : filteredHotels.length === 0 ? (
					<EmptyState
						title={search ? "No results" : "No hotels yet"}
						description={
							search
								? "Try a different search term."
								: "Create your first hotel to start managing inventory."
						}
						action={
							<Button onClick={() => setOpen(true)}>
								<Plus className="h-4 w-4 mr-2" />
								Add Hotel
							</Button>
						}
					/>
				) : (
					<Card className="luxury-panel overflow-hidden">
						<CardHeader>
							<CardTitle>{filteredHotels.length} Hotels</CardTitle>
						</CardHeader>

						<CardContent className="p-0">
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
											<TableCell className="font-medium">
												{hotel.name}
											</TableCell>

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
						</CardContent>
					</Card>
				)}
			</div>
		</PageContainer>
	);
}
