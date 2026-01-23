"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";

type Amenity = {
	_id: string;
	name: string;
	icon?: string;
};

const amenitySchema = z.object({
	name: z.string().min(1, "Name is required"),
	icon: z.string().optional().or(z.literal("")),
});

type AmenityFormValues = z.infer<typeof amenitySchema>;

export default function AmenitiesManagementPage() {
	const [amenities, setAmenities] = useState<Amenity[]>([]);
	const [selected, setSelected] = useState<Amenity | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AmenityFormValues>({
		resolver: zodResolver(amenitySchema),
		defaultValues: { name: "", icon: "" },
	});

	const loadAmenities = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get("/amenities");
			setAmenities(res.data);
		} catch (e) {
			setError(getErrorMessage(e, "Failed to load amenities"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAmenities();
	}, [loadAmenities]);

	useEffect(() => {
		if (!open) return;
		reset({ name: selected?.name ?? "", icon: selected?.icon ?? "" });
	}, [open, reset, selected]);

	const onSubmit = async (values: AmenityFormValues) => {
		setSaving(true);
		try {
			if (selected?._id) {
				const res = await api.put(`/amenities/${selected._id}`, {
					name: values.name,
					icon: values.icon || undefined,
				});
				setAmenities((prev) =>
					prev.map((a) => (a._id === selected._id ? res.data : a)),
				);
				toast.success("Amenity updated");
			} else {
				const res = await api.post("/amenities", {
					name: values.name,
					icon: values.icon || undefined,
				});
				setAmenities((prev) => [res.data, ...prev]);
				toast.success("Amenity added");
			}
			setOpen(false);
			setSelected(null);
		} catch (e) {
			toast.error(getErrorMessage(e, "Failed to save amenity"));
		} finally {
			setSaving(false);
		}
	};

	const deleteAmenity = async (id: string) => {
		setDeletingId(id);
		try {
			await api.delete(`/amenities/${id}`);
			setAmenities((prev) => prev.filter((a) => a._id !== id));
			toast.success("Amenity deleted");
		} catch (e) {
			toast.error(getErrorMessage(e, "Failed to delete amenity"));
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<PageContainer>
			<PageHeader
				title="Amenities"
				description="Manage amenities available across your properties"
				actions={
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={loadAmenities}>
							Refresh
						</Button>
						<Button
							onClick={() => {
								setSelected(null);
								setOpen(true);
							}}
						>
							Add Amenity
						</Button>
					</div>
				}
			/>

			{error ? (
				<EmptyState
					title="Couldn’t load amenities"
					description={error}
					action={<RetryButton onClick={loadAmenities} />}
				/>
			) : null}

			{!error && !loading && amenities.length === 0 ? (
				<EmptyState
					title="No amenities yet"
					description="Add your first amenity to make it selectable across hotels and rooms."
					action={
						<Button
							onClick={() => {
								setSelected(null);
								setOpen(true);
							}}
						>
							Add Amenity
						</Button>
					}
				/>
			) : null}

			{!error && (loading || amenities.length > 0) ? (
				<div className="luxury-panel rounded-2xl overflow-hidden">
					{loading ? (
						<div className="p-6 text-muted-foreground">Loading amenities…</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Icon</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{amenities.map((a) => (
									<TableRow key={a._id}>
										<TableCell className="font-medium">{a.name}</TableCell>
										<TableCell className="text-muted-foreground">
											{a.icon || "—"}
										</TableCell>
										<TableCell className="text-right space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => {
													setSelected(a);
													setOpen(true);
												}}
											>
												Edit
											</Button>
											<Button
												size="sm"
												variant="destructive"
												onClick={() => deleteAmenity(a._id)}
												disabled={deletingId === a._id}
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
				<DialogContent className="max-w-md luxury-panel border-white/10">
					<DialogHeader>
						<DialogTitle>
							{selected?._id ? "Edit Amenity" : "Add Amenity"}
						</DialogTitle>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="e.g. Free Wi‑Fi"
								{...register("name")}
							/>
							{errors.name ? (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							) : null}
						</div>
						<div className="space-y-2">
							<Label htmlFor="icon">Icon (optional)</Label>
							<Input id="icon" placeholder="e.g. wifi" {...register("icon")} />
							{errors.icon ? (
								<p className="text-sm text-destructive">
									{errors.icon.message}
								</p>
							) : null}
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
