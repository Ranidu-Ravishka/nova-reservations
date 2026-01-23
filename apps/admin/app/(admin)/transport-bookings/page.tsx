"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

type TransportService = {
	_id: string;
	type: string;
	route: string;
	price: number;
	capacity: number;
};

const transportSchema = z.object({
	type: z.string().min(1, "Type is required"),
	route: z.string().min(1, "Route is required"),
	price: z.coerce.number().min(0, "Price must be 0 or higher"),
	capacity: z.coerce
		.number()
		.int("Capacity must be a whole number")
		.min(1, "Capacity must be at least 1"),
});

type TransportFormInput = z.input<typeof transportSchema>;
type TransportFormValues = z.output<typeof transportSchema>;

export default function TransportBookingsPage() {
	const [services, setServices] = useState<TransportService[]>([]);
	const [selected, setSelected] = useState<TransportService | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TransportFormInput, unknown, TransportFormValues>({
		resolver: zodResolver(transportSchema),
		defaultValues: { type: "", route: "", price: 0, capacity: 1 },
	});

	const typeValue = watch("type");

	const loadServices = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get("/transports");
			setServices(res.data);
		} catch (e) {
			setError(getErrorMessage(e, "Failed to load transport services"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadServices();
	}, [loadServices]);

	useEffect(() => {
		if (!open) return;
		reset({
			type: selected?.type ?? "",
			route: selected?.route ?? "",
			price: selected?.price ?? 0,
			capacity: selected?.capacity ?? 1,
		});
	}, [open, reset, selected]);

	const onSubmit = async (values: TransportFormValues) => {
		setSaving(true);
		try {
			if (selected?._id) {
				const res = await api.put(`/transports/${selected._id}`, values);
				setServices((prev) =>
					prev.map((s) => (s._id === selected._id ? res.data : s)),
				);
				toast.success("Transport service updated");
			} else {
				const res = await api.post("/transports", values);
				setServices((prev) => [res.data, ...prev]);
				toast.success("Transport service added");
			}
			setOpen(false);
			setSelected(null);
		} catch (e) {
			toast.error(getErrorMessage(e, "Failed to save transport service"));
		} finally {
			setSaving(false);
		}
	};

	const deleteService = async (id: string) => {
		setDeletingId(id);
		try {
			await api.delete(`/transports/${id}`);
			setServices((prev) => prev.filter((s) => s._id !== id));
			toast.success("Transport service deleted");
		} catch (e) {
			toast.error(getErrorMessage(e, "Failed to delete transport service"));
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<PageContainer>
			<PageHeader
				title="Transport Services"
				description="Manage transport service offerings (routes, prices, capacity)"
				actions={
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={loadServices}>
							Refresh
						</Button>
						<Button
							onClick={() => {
								setSelected(null);
								setOpen(true);
							}}
						>
							Add Service
						</Button>
					</div>
				}
			/>

			{error ? (
				<EmptyState
					title="Couldn’t load transport services"
					description={error}
					action={<RetryButton onClick={loadServices} />}
				/>
			) : null}

			{!error && !loading && services.length === 0 ? (
				<EmptyState
					title="No transport services"
					description="Add a service to start offering transfers and rides."
					action={
						<Button
							onClick={() => {
								setSelected(null);
								setOpen(true);
							}}
						>
							Add Service
						</Button>
					}
				/>
			) : null}

			{!error && (loading || services.length > 0) ? (
				<div className="rounded-lg border bg-card">
					{loading ? (
						<div className="p-4 text-muted-foreground">
							Loading transport services…
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Type</TableHead>
									<TableHead>Route</TableHead>
									<TableHead>Capacity</TableHead>
									<TableHead>Price</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{services.map((s) => (
									<TableRow key={s._id}>
										<TableCell className="font-medium">
											<Badge variant="secondary">{s.type}</Badge>
										</TableCell>
										<TableCell>{s.route}</TableCell>
										<TableCell>{s.capacity}</TableCell>
										<TableCell>${s.price}</TableCell>
										<TableCell className="text-right space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => {
													setSelected(s);
													setOpen(true);
												}}
											>
												Edit
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() => deleteService(s._id)}
												disabled={deletingId === s._id}
											>
												Delete
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			) : null}

			<Dialog
				open={open}
				onOpenChange={(o) => {
					setOpen(o);
					if (!o) setSelected(null);
				}}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{selected?._id ? "Edit Service" : "Add Service"}
						</DialogTitle>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-2">
							<Label>Type</Label>
							<Select
								value={typeValue}
								onValueChange={(value) =>
									setValue("type", value, { shouldValidate: true })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Airport Pickup">Airport Pickup</SelectItem>
									<SelectItem value="Intercity Transfer">
										Intercity Transfer
									</SelectItem>
									<SelectItem value="City Ride">City Ride</SelectItem>
								</SelectContent>
							</Select>
							{errors.type ? (
								<p className="text-sm text-destructive">
									{errors.type.message}
								</p>
							) : null}
						</div>

						<div className="space-y-2">
							<Label htmlFor="route">Route</Label>
							<Input
								id="route"
								placeholder="e.g. BIA → Nova Colombo"
								{...register("route")}
							/>
							{errors.route ? (
								<p className="text-sm text-destructive">
									{errors.route.message}
								</p>
							) : null}
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="capacity">Capacity</Label>
								<Input
									id="capacity"
									type="number"
									min={1}
									{...register("capacity")}
								/>
								{errors.capacity ? (
									<p className="text-sm text-destructive">
										{errors.capacity.message}
									</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="price">Price</Label>
								<Input
									id="price"
									type="number"
									min={0}
									step="0.01"
									{...register("price")}
								/>
								{errors.price ? (
									<p className="text-sm text-destructive">
										{errors.price.message}
									</p>
								) : null}
							</div>
						</div>

						<Button className="w-full" type="submit" disabled={saving}>
							{saving ? "Saving…" : "Save"}
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		</PageContainer>
	);
}
