"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

type Staff = {
	_id: string;
	name: string;
	role: string;
	email?: string;
	phone?: string;
	hotelId?: { _id: string; name: string } | string | null;
};

type HotelLite = { _id: string; name: string };

const staffSchema = z.object({
	name: z.string().min(1, "Name is required"),
	role: z.string().min(1, "Role is required"),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	phone: z.string().optional().or(z.literal("")),
	hotelId: z.string().min(1, "Assigned hotel is required"),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export default function StaffManagementPage() {
	const [staff, setStaff] = useState<Staff[]>([]);
	const [hotels, setHotels] = useState<HotelLite[]>([]);
	const [selected, setSelected] = useState<Staff | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
		watch,
	} = useForm<StaffFormValues>({
		resolver: zodResolver(staffSchema),
		defaultValues: {
			name: "",
			role: "",
			email: "",
			phone: "",
			hotelId: "",
		},
	});

	const hotelIdValue = watch("hotelId");
	const roleValue = watch("role");

	const loadAll = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [staffRes, hotelsRes] = await Promise.all([
				api.get("/staff"),
				api.get("/hotels"),
			]);
			setStaff(staffRes.data);
			setHotels(hotelsRes.data);
		} catch (e) {
			setError(getErrorMessage(e, "Failed to load staff"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadAll();
	}, [loadAll]);

	useEffect(() => {
		if (!open) return;
		if (selected?._id) {
			reset({
				name: selected.name ?? "",
				role: selected.role ?? "",
				email: selected.email ?? "",
				phone: selected.phone ?? "",
				hotelId:
					typeof selected.hotelId === "string"
						? selected.hotelId
						: (selected.hotelId?._id ?? ""),
			});
		} else {
			reset({ name: "", role: "", email: "", phone: "", hotelId: "" });
		}
	}, [open, reset, selected]);

	const onSubmit = async (values: StaffFormValues) => {
		setSaving(true);
		try {
			if (selected?._id) {
				const res = await api.put(`/staff/${selected._id}`, {
					name: values.name,
					role: values.role,
					email: values.email || undefined,
					phone: values.phone || undefined,
					hotelId: values.hotelId,
				});
				setStaff((prev) =>
					prev.map((s) => (s._id === selected._id ? res.data : s)),
				);
				toast.success("Staff updated");
			} else {
				const res = await api.post("/staff", {
					name: values.name,
					role: values.role,
					email: values.email || undefined,
					phone: values.phone || undefined,
					hotelId: values.hotelId,
				});
				setStaff((prev) => [res.data, ...prev]);
				toast.success("Staff added");
			}
			setOpen(false);
			setSelected(null);
		} catch (e) {
			toast.error(getErrorMessage(e, "Failed to save staff"));
		} finally {
			setSaving(false);
		}
	};

	const deleteStaff = async (id: string) => {
		setDeletingId(id);
		try {
			await api.delete(`/staff/${id}`);
			setStaff((prev) => prev.filter((s) => s._id !== id));
			toast.success("Staff removed");
		} catch (e) {
			toast.error(getErrorMessage(e, "Failed to delete staff"));
		} finally {
			setDeletingId(null);
		}
	};

	const hotelNameFor = useMemo(() => {
		const map = new Map(hotels.map((h) => [h._id, h.name]));
		return (s: Staff) => {
			if (!s.hotelId) return "—";
			if (typeof s.hotelId === "string") return map.get(s.hotelId) ?? "—";
			return s.hotelId.name ?? map.get(s.hotelId._id) ?? "—";
		};
	}, [hotels]);

	const assignedCount = staff.filter((s) => !!s.hotelId).length;

	return (
		<PageContainer>
			<PageHeader
				title="Staff"
				description="Manage staff members and hotel assignments"
				actions={
					<div className="flex items-center gap-2">
						<Button variant="outline" onClick={loadAll}>
							Refresh
						</Button>
						<Button
							onClick={() => {
								setSelected(null);
								setOpen(true);
							}}
						>
							Add Staff
						</Button>
					</div>
				}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Total Staff
						</p>
						<p className="text-3xl font-display mt-2">{staff.length}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Assigned Hotels
						</p>
						<p className="text-3xl font-display mt-2">{assignedCount}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Unassigned
						</p>
						<p className="text-3xl font-display mt-2">
							{staff.length - assignedCount}
						</p>
					</CardContent>
				</Card>
			</div>

			{error ? (
				<EmptyState
					title="Couldn’t load staff"
					description={error}
					action={<RetryButton onClick={loadAll} />}
				/>
			) : null}

			{!error && !loading && staff.length === 0 ? (
				<EmptyState
					title="No staff members"
					description="Add your first staff member to get started."
					action={
						<Button
							onClick={() => {
								setSelected(null);
								setOpen(true);
							}}
						>
							Add Staff
						</Button>
					}
				/>
			) : null}

			{!error && (loading || staff.length > 0) ? (
				<div className="luxury-panel rounded-2xl overflow-hidden">
					{loading ? (
						<div className="p-6 text-muted-foreground">Loading staff…</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Hotel</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{staff.map((s) => (
									<TableRow key={s._id}>
										<TableCell className="font-medium">{s.name}</TableCell>
										<TableCell>{s.role}</TableCell>
										<TableCell>{s.email || "—"}</TableCell>
										<TableCell>{s.phone || "—"}</TableCell>
										<TableCell>{hotelNameFor(s)}</TableCell>
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
												onClick={() => deleteStaff(s._id)}
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
					if (!o) {
						setSelected(null);
						reset({ name: "", role: "", email: "", phone: "", hotelId: "" });
					}
				}}
			>
				<DialogContent className="max-w-md luxury-panel border-white/10">
					<DialogHeader>
						<DialogTitle>
							{selected?._id ? "Edit Staff" : "Add Staff"}
						</DialogTitle>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-2">
							<Label htmlFor="name">Full name</Label>
							<Input id="name" placeholder="Full Name" {...register("name")} />
							{errors.name ? (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							) : null}
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									placeholder="name@hotel.com"
									{...register("email")}
								/>
								{errors.email ? (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								) : null}
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input id="phone" placeholder="+94…" {...register("phone")} />
								{errors.phone ? (
									<p className="text-sm text-destructive">
										{errors.phone.message}
									</p>
								) : null}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Role</Label>
							<Select
								value={roleValue}
								onValueChange={(value) =>
									setValue("role", value, { shouldValidate: true })
								}
							>
								<SelectTrigger className="bg-white/5 border-white/10">
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="DRIVER">Driver</SelectItem>
									<SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
									<SelectItem value="STAFF">Staff</SelectItem>
								</SelectContent>
							</Select>
							{errors.role ? (
								<p className="text-sm text-destructive">
									{errors.role.message}
								</p>
							) : null}
						</div>

						<div className="space-y-2">
							<Label>Assigned hotel</Label>
							<Select
								value={hotelIdValue}
								onValueChange={(value) =>
									setValue("hotelId", value, { shouldValidate: true })
								}
							>
								<SelectTrigger className="bg-white/5 border-white/10">
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
							{errors.hotelId ? (
								<p className="text-sm text-destructive">
									{errors.hotelId.message}
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
