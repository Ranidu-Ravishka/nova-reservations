import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller";
import { adminOnly, protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);

export default router;
