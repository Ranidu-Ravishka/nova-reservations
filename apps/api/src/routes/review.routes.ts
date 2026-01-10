import { Router } from "express";
import {
	createReview,
	deleteReview,
	getReviews,
} from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("CUSTOMER"), createReview);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteReview);
router.get("/", getReviews);

export default router;
