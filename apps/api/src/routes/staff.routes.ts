import { Router } from "express";
import {
	createStaff,
	deleteStaff,
	getStaff,
	updateStaff,
} from "../controllers/staff.controller";

const router = Router();

router.post("/", createStaff);
router.get("/", getStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
