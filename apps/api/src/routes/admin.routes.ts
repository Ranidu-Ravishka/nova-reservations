import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.middleware";
import { getDashboardStats } from "../controllers/admin.controller";

const router = Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);

export default router;
