import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createStaff,
	deleteStaff,
	getStaff,
	updateStaff,
} from "../controllers/staff.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(requireAuth, authorize(Roles.ADMIN));

router.post("/", createStaff);
router.get("/", getStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;
