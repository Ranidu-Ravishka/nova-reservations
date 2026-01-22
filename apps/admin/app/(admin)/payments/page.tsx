"use client";

import { useCallback, useEffect, useState } from "react";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
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

type Payment = {
	_id: string;
	amount: number;
	currency: string;
	method: string;
	status: "PENDING" | "PAID" | "FAILED";
	userId: { name: string; email: string };
	createdAt: string;
};

export default function PaymentsPage() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get<Payment[]>("/payments");
			setPayments(res.data);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Failed to load payments"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	return (
		<PageContainer>
			<PageHeader title="Payments" description="Monitor payment activity" />

			<div className="mt-4">
				{error ? (
					<EmptyState
						title="Couldn’t load payments"
						description={error}
						action={<RetryButton onClick={load} />}
					/>
				) : loading ? (
					<p className="text-sm text-muted-foreground">Loading payments…</p>
				) : payments.length === 0 ? (
					<EmptyState title="No payments" description="No payments found." />
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Method</TableHead>
								<TableHead>Date</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{payments.map((p) => (
								<TableRow key={p._id}>
									<TableCell>{p.userId.name}</TableCell>
									<TableCell>{p.userId.email}</TableCell>
									<TableCell>
										${p.amount} {p.currency}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												p.status === "PAID"
													? "default"
													: p.status === "FAILED"
														? "destructive"
														: "secondary"
											}
										>
											{p.status}
										</Badge>
									</TableCell>
									<TableCell>{p.method}</TableCell>
									<TableCell>
										{new Date(p.createdAt).toLocaleDateString()}
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
