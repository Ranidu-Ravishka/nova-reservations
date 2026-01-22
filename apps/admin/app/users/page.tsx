"use client";

import { useEffect, useState } from "react";
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

type User = {
	_id: string;
	name: string;
	email: string;
	role: "ADMIN" | "CUSTOMER" | "STAFF";
};

export default function UsersPage() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		fetch("http://localhost:4000/api/users", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
			},
		})
			.then((res) => res.json())
			.then(setUsers);
	}, []);

	const updateRole = async (id: string, role: User["role"]) => {
		await fetch(`http://localhost:4000/api/users/${id}/role`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
			},
			body: JSON.stringify({ role }),
		});

		setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
	};

	const deleteUser = async (id: string) => {
		await fetch(`http://localhost:4000/api/users/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
			},
		});

		setUsers((prev) => prev.filter((u) => u._id !== id));
	};

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">Users</h1>

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
								<Badge>{user.role}</Badge>
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
		</div>
	);
}
