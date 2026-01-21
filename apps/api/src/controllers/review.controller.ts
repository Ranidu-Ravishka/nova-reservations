import type { Request, Response } from "express";
import { Review } from "../models/Review";

export const createReview = async (req: Request, res: Response) => {
	res.status(201).json(await Review.create(req.body));
};

export const getReviews = async (req: Request, res: Response) => {
	const filter = req.query.hotelId ? { hotelId: req.query.hotelId } : {};
	res.json(await Review.find(filter).populate("userId"));
};

export const deleteReview = async (req: Request, res: Response) => {
	await Review.findByIdAndDelete(req.params.id);
	res.json({ message: "Review removed" });
};
