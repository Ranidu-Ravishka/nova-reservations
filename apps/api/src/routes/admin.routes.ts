import { Router } from "express";
import { Roles } from "../constants/roles";
import { getDashboardStats } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", authenticate, getDashboardStats);
export default router;
