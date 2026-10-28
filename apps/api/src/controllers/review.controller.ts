import type { Request, Response } from "express";
import { Types } from "mongoose";
import type { AuthRequest } from "../middleware/auth.middleware";
import { Review } from "../models/Review";

export const createReview = async (req: AuthRequest, res: Response) => {
	const { hotelId, rating, comment } = req.body ?? {};

	if (
		!req.user?.id ||
		typeof hotelId !== "string" ||
		!Types.ObjectId.isValid(hotelId) ||
		typeof rating !== "number" ||
		!Number.isInteger(rating) ||
		rating < 1 ||
		rating > 5 ||
		(comment !== undefined &&
			(typeof comment !== "string" || comment.trim().length > 2000))
	) {
		return res.status(400).json({ message: "Invalid review data" });
	}

	const review = await Review.create({
		userId: req.user.id,
		hotelId,
		rating,
		comment: typeof comment === "string" ? comment.trim() : undefined,
	});

	return res.status(201).json(review);
};

export const getReviews = async (req: Request, res: Response) => {
	const hotelId = req.query.hotelId;
	if (
		hotelId !== undefined &&
		(typeof hotelId !== "string" || !Types.ObjectId.isValid(hotelId))
	) {
		return res.status(400).json({ message: "Invalid hotel identifier" });
	}

	const filter = hotelId ? { hotelId } : {};
	return res.json(await Review.find(filter).populate("userId", "name"));
};

export const deleteReview = async (req: Request, res: Response) => {
	const review = await Review.findByIdAndDelete(req.params.id);
	if (!review) return res.status(404).json({ message: "Review not found" });
	return res.json({ message: "Review removed" });
};
