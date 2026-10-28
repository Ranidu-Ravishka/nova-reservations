"use client";

import { useCallback, useEffect, useState } from "react";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
	status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
	userId?: { name?: string; email?: string };
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

	const paidTotal = payments
		.filter((payment) => payment.status === "PAID")
		.reduce((sum, payment) => sum + payment.amount, 0);

	return (
		<PageContainer>
			<PageHeader title="Payments" description="Monitor payment activity" />

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Total Payments
						</p>
						<p className="text-3xl font-display mt-2">{payments.length}</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Paid Revenue
						</p>
						<p className="text-3xl font-display mt-2">
							${paidTotal.toFixed(0)}
						</p>
					</CardContent>
				</Card>
				<Card className="luxury-card">
					<CardContent className="p-5">
						<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
							Pending / Failed
						</p>
						<p className="text-3xl font-display mt-2">
							{
								payments.filter(
									(payment) =>
										payment.status === "PENDING" || payment.status === "FAILED",
								).length
							}
						</p>
					</CardContent>
				</Card>
			</div>

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
					<div className="luxury-panel rounded-2xl overflow-hidden">
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
										<TableCell>{p.userId?.name || "—"}</TableCell>
										<TableCell>{p.userId?.email || "—"}</TableCell>
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
					</div>
				)}
			</div>
		</PageContainer>
	);
}
