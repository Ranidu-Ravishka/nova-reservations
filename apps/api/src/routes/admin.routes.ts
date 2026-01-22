import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/dashboard", authenticate, authorize("admin"), getDashboardStats);

export default router;
