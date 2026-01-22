import { Router } from "express";
import {
	createPayment,
	executePayment,
	getPayments,
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/* ---------------- USER ROUTES ---------------- */
router.post("/", authenticate, createPayment); // create payment
router.post("/execute", authenticate, executePayment); // execute payment

/* ---------------- ADMIN ROUTES ---------------- */
router.get("/", getPayments); // optionally, add admin auth here

export default router;
