import { Router } from "express";
import { Roles } from "../constants/roles";
import { getDashboardStats } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// Require ADMIN role to access admin dashboard
router.get(
	"/dashboard",
	authenticate,
	authorize(Roles.ADMIN),
	getDashboardStats,
);

export default router;
