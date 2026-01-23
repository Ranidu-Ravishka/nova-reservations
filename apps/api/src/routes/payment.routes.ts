import { Router } from "express";
import { Roles } from "../constants/roles";
import {
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
router.get("/", requireAuth, authorize(Roles.ADMIN, Roles.STAFF), getPayments);

export default router;
