import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createTransport,
	deleteTransport,
	getTransports,
	updateTransport,
} from "../controllers/transport.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, authorize(Roles.ADMIN), createTransport);
router.delete("/:id", requireAuth, authorize(Roles.ADMIN), deleteTransport);
router.get("/", getTransports);
router.put("/:id", requireAuth, authorize(Roles.ADMIN), updateTransport);

export default router;
