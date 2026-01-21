import { Router } from "express";
import {
	createTransport,
	deleteTransport,
	getTransports,
	updateTransport,
} from "../controllers/transport.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.post("/", authenticate, authorize("ADMIN"), createTransport);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteTransport);
router.get("/", getTransports);
router.put("/:id", authenticate, authorize("ADMIN"), updateTransport);

export default router;
