"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type User = {
	_id: string;
	name: string;
	email: string;
	role: "ADMIN" | "CUSTOMER" | "STAFF";
};

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get<User[]>("/users");
			setUsers(res.data);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Failed to load users"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const updateRole = async (id: string, role: User["role"]) => {
		try {
			await api.put(`/users/${id}/role`, { role });
			setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
			toast.success("Role updated");
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to update role"));
		}
	};

	const deleteUser = async (id: string) => {
		if (!confirm("Delete this user?")) return;
		try {
			await api.delete(`/users/${id}`);
			setUsers((prev) => prev.filter((u) => u._id !== id));
			toast.success("User deleted");
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to delete user"));
		}
	};

	return (
		<PageContainer>
			<PageHeader
				title="Users"
				description="Manage customer and staff accounts"
			/>

			<div className="mt-4">
				{error ? (
					<EmptyState
						title="Couldn’t load users"
						description={error}
						action={<RetryButton onClick={load} />}
					/>
				) : loading ? (
					<p className="text-sm text-muted-foreground">Loading users…</p>
				) : users.length === 0 ? (
					<EmptyState title="No users" description="No users found." />
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{users.map((user) => (
								<TableRow key={user._id}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										<Badge variant="outline">{user.role}</Badge>
									</TableCell>
									<TableCell className="text-right space-x-2">
										{user.role !== "ADMIN" && (
											<Button
												size="sm"
												variant="outline"
												onClick={() => updateRole(user._id, "STAFF")}
											>
												Make Staff
											</Button>
										)}
										<Button
											size="sm"
											variant="destructive"
											onClick={() => deleteUser(user._id)}
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
		</PageContainer>
	);
}
