import { Router } from "express";

import { Roles } from "../constants/roles";
import {
	createTransportRequest,
	getTransportRequests,
} from "../controllers/transportRequest.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Public: allow users to request a transfer without needing an account.
router.post("/", createTransportRequest);

// Admin: view all requests.
router.get("/", requireAuth, authorize(Roles.ADMIN), getTransportRequests);

export default router;
