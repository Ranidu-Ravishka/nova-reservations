import { Router } from "express";
import {
	createPayment,
	executePayment,
	getPayments,
} from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createPayment);
router.post("/execute", requireAuth, executePayment);
router.get("/", getPayments);

export default router;
