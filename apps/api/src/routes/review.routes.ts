import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createReview,
	deleteReview,
	getReviews,
} from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", authenticate, authorize(Roles.CUSTOMER), createReview);
router.delete("/:id", authenticate, authorize(Roles.ADMIN), deleteReview);
router.get("/", getReviews);

export default router;
