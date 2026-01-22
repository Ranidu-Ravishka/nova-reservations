import { Router } from "express";

import { Roles } from "../constants/roles";
import {
	createTransportRequest,
	getTransportRequests,
} from "../controllers/transportRequest.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Public: allow users to request a transfer without needing an account.
router.post("/", createTransportRequest);

// Admin: view all requests.
router.get("/", authenticate, authorize(Roles.ADMIN), getTransportRequests);

export default router;
