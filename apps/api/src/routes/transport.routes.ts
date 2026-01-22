import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createTransport,
	deleteTransport,
	getTransports,
	updateTransport,
} from "../controllers/transport.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize(Roles.ADMIN), createTransport);
router.delete("/:id", authenticate, authorize(Roles.ADMIN), deleteTransport);
router.get("/", getTransports);
router.put("/:id", authenticate, authorize(Roles.ADMIN), updateTransport);

export default router;
