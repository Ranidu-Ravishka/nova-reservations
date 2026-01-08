import { Router } from "express";
import {
	createReview,
	deleteReview,
	getReviews,
} from "../controllers/review.controller";

const router = Router();

router.post("/", createReview);
router.get("/", getReviews);
router.delete("/:id", deleteReview);

export default router;
