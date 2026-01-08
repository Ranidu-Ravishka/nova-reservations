import { Router } from "express";
import {
	createTransport,
	deleteTransport,
	getTransports,
	updateTransport,
} from "../controllers/transport.controller";

const router = Router();

router.post("/", createTransport);
router.get("/", getTransports);
router.put("/:id", updateTransport);
router.delete("/:id", deleteTransport);

export default router;
