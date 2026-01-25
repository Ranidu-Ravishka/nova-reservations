import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	captureOrder,
	createOrder,
	createPayment,
	executePayment,
	getPayments,
} from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, createPayment);
router.post("/create", requireAuth, createPayment);
router.post("/execute", requireAuth, executePayment);
router.post("/create-order", requireAuth, createOrder);
router.post("/capture-order", requireAuth, captureOrder);
router.get("/", requireAuth, authorize(Roles.ADMIN, Roles.STAFF), getPayments);

export default router;
