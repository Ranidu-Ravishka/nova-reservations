import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller";
import { requireAdmin } from "../middleware/admin.middleware";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/dashboard", requireAuth, requireAdmin, getDashboardStats);

export default router;
