"use client";

import { useCallback, useEffect, useState } from "react";
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

interface TransportService {
	type: string;
	route: string;
}

interface TransportRequest {
	_id: string;
	transportId: string | TransportService | null;
	name: string;
	email: string;
	phone: string;
	pickupLocation?: string;
	dropoffLocation?: string;
	pickupDate?: string;
	passengers?: number;
	notes?: string;
	status: "PENDING" | "CONFIRMED" | "CANCELLED";
	createdAt: string;
}

function formatDate(value?: string) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function TransportRequestsPage() {
	const [requests, setRequests] = useState<TransportRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadRequests = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get("/transport-requests");
			setRequests(response.data);
		} catch (loadError) {
			setError(getErrorMessage(loadError, "Failed to load transport requests"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadRequests();
	}, [loadRequests]);

	return (
		<PageContainer>
			<PageHeader
				title="Transport Requests"
				description="Review customer-submitted transport requests"
				actions={
					<Button variant="outline" onClick={loadRequests} disabled={loading}>
						Refresh
					</Button>
				}
			/>

			{error ? (
				<EmptyState
					title="Couldn’t load transport requests"
					description={error}
					action={<RetryButton onClick={loadRequests} />}
				/>
			) : null}

			{!error && !loading && requests.length === 0 ? (
				<EmptyState
					title="No transport requests"
					description="Customer requests will appear here."
					action={
						<Button variant="outline" onClick={loadRequests}>
							Refresh
						</Button>
					}
				/>
			) : null}

			{!error && (loading || requests.length > 0) ? (
				<div className="luxury-panel overflow-x-auto rounded-2xl">
					{loading ? (
						<div className="p-6 text-muted-foreground">
							Loading transport requests…
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead>Service</TableHead>
									<TableHead>Pickup</TableHead>
									<TableHead>Drop-off</TableHead>
									<TableHead>Pickup date</TableHead>
									<TableHead>Passengers</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Notes</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{requests.map((request) => {
									const service =
										typeof request.transportId === "object"
											? request.transportId
											: null;

									return (
										<TableRow key={request._id}>
											<TableCell>
												<div className="font-medium">{request.name}</div>
												<div className="text-sm text-muted-foreground">
													{request.email}
												</div>
												<div className="text-sm text-muted-foreground">
													{request.phone}
												</div>
											</TableCell>
											<TableCell>
												{service ? `${service.type} · ${service.route}` : "—"}
											</TableCell>
											<TableCell>{request.pickupLocation || "—"}</TableCell>
											<TableCell>{request.dropoffLocation || "—"}</TableCell>
											<TableCell>{formatDate(request.pickupDate)}</TableCell>
											<TableCell>{request.passengers ?? "—"}</TableCell>
											<TableCell>
												<Badge
													variant={
														request.status === "CONFIRMED"
															? "default"
															: request.status === "CANCELLED"
																? "destructive"
																: "secondary"
													}
												>
													{request.status}
												</Badge>
											</TableCell>
											<TableCell>{request.notes || "—"}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</div>
			) : null}
		</PageContainer>
	);
}
