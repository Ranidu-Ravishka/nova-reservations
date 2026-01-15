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

// Dummy staff data (replace with API)
type Staff = {
	id: string;
	name: string;
	role: string;
	assignedHotel: string;
	status: string;
};

const initialStaff: Staff[] = [
	{
		id: "ST-001",
		name: "Kasun Perera",
		role: "DRIVER",
		assignedHotel: "Nova Colombo",
		status: "ACTIVE",
	},
	{
		id: "ST-002",
		name: "Nimali Fernando",
		role: "RECEPTIONIST",
		assignedHotel: "Nova Kandy",
		status: "ACTIVE",
	},
];

export default function StaffManagementPage() {
	const [staff, setStaff] = useState<Staff[]>(initialStaff);
	const [selected, setSelected] = useState<Staff | null>(null);
	const [form, setForm] = useState({ name: "", role: "", assignedHotel: "" });
	const [open, setOpen] = useState(false);

	const saveStaff = () => {
		if (selected) {
			setStaff((prev) =>
				prev.map((s) => (s.id === selected.id ? { ...s, ...form } : s)),
			);
		} else {
			setStaff((prev) => [
				...prev,
				{
					id: `ST-${prev.length + 1}`,
					...form,
					status: "ACTIVE",
				},
			]);
		}
		setSelected(null);
		setForm({ name: "", role: "", assignedHotel: "" });
		setOpen(false);
	};

	return (
		<div className="p-6 space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Staff Management</CardTitle>
					<Button
						onClick={() => {
							setSelected(null);
							setForm({ name: "", role: "", assignedHotel: "" });
							setOpen(true);
						}}
					>
						Add Staff
					</Button>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Hotel</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staff.map((s) => (
								<TableRow key={s.id}>
									<TableCell>{s.id}</TableCell>
									<TableCell>{s.name}</TableCell>
									<TableCell>{s.role}</TableCell>
									<TableCell>{s.assignedHotel}</TableCell>
									<TableCell>
										<Badge>{s.status}</Badge>
									</TableCell>
									<TableCell className="text-right space-x-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setSelected(s);
												setForm({
													name: s.name,
													role: s.role,
													assignedHotel: s.assignedHotel,
												});
												setOpen(true);
											}}
										>
											Edit
										</Button>
										<Button
											size="sm"
											variant="destructive"
											onClick={() =>
												setStaff((prev) => prev.filter((x) => x.id !== s.id))
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
				open={open}
				onOpenChange={(o) => {
					setOpen(o);
					if (!o) {
						setSelected(null);
						setForm({ name: "", role: "", assignedHotel: "" });
					}
				}}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{selected?.id ? "Edit Staff" : "Add Staff"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<Input
							placeholder="Full Name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
						<Select
							value={form.role}
							onValueChange={(value) => setForm({ ...form, role: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="DRIVER">Driver</SelectItem>
								<SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={form.assignedHotel}
							onValueChange={(value) =>
								setForm({ ...form, assignedHotel: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Assign Hotel" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Nova Colombo">Nova Colombo</SelectItem>
								<SelectItem value="Nova Kandy">Nova Kandy</SelectItem>
								<SelectItem value="Nova Galle">Nova Galle</SelectItem>
								<SelectItem value="Nova Nuwara Eliya">
									Nova Nuwara Eliya
								</SelectItem>
							</SelectContent>
						</Select>
						<Button className="w-full" onClick={saveStaff}>
							Save
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
