import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createUser,
	deleteUser,
	getUsers,
	updateUser,
	updateUserRole,
} from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(requireAuth, authorize(Roles.ADMIN));

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id/role", updateUserRole);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
