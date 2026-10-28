"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState, { RetryButton } from "@/components/admin/EmptyState";
import PageContainer from "@/components/admin/PageContainer";
import PageHeader from "@/components/admin/PageHeader";
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

interface Review {
	_id: string;
	userId?: { name?: string } | string;
	hotelId: string;
	rating: number;
	comment?: string;
	createdAt?: string;
}

const formatDate = (value?: string) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

export default function ReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const loadReviews = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.get<Review[]>("/reviews");
			setReviews(response.data);
		} catch (err: unknown) {
			setError(getErrorMessage(err, "Failed to load reviews"));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadReviews();
	}, [loadReviews]);

	const removeReview = async (review: Review) => {
		if (!window.confirm("Delete this review? This action cannot be undone.")) {
			return;
		}

		setDeletingId(review._id);
		try {
			await api.delete(`/reviews/${review._id}`);
			setReviews((current) =>
				current.filter((item) => item._id !== review._id),
			);
			toast.success("Review deleted");
		} catch (err: unknown) {
			toast.error(getErrorMessage(err, "Failed to delete review"));
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<PageContainer>
			<PageHeader
				title="Reviews"
				description="Review guest feedback and remove inappropriate submissions"
				actions={
					<Button variant="outline" onClick={loadReviews} disabled={loading}>
						Refresh
					</Button>
				}
			/>

			{error ? (
				<EmptyState
					title="Couldn’t load reviews"
					description={error}
					action={<RetryButton onClick={loadReviews} />}
				/>
			) : loading ? (
				<p className="text-sm text-muted-foreground">Loading reviews…</p>
			) : reviews.length === 0 ? (
				<EmptyState title="No reviews" description="No guest reviews found." />
			) : (
				<div className="luxury-panel rounded-2xl overflow-hidden">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Guest</TableHead>
								<TableHead>Hotel ID</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead>Comment</TableHead>
								<TableHead>Date</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reviews.map((review) => (
								<TableRow key={review._id}>
									<TableCell>
										{typeof review.userId === "object"
											? review.userId?.name || "—"
											: "—"}
									</TableCell>
									<TableCell>{review.hotelId}</TableCell>
									<TableCell>{review.rating}/5</TableCell>
									<TableCell className="max-w-72 whitespace-normal break-words">
										{review.comment || "—"}
									</TableCell>
									<TableCell>{formatDate(review.createdAt)}</TableCell>
									<TableCell className="text-right">
										<Button
											variant="destructive"
											size="sm"
											disabled={deletingId === review._id}
											onClick={() => removeReview(review)}
										>
											{deletingId === review._id ? "Deleting…" : "Delete"}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</PageContainer>
	);
}
