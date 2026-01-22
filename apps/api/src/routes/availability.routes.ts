import { Router } from "express";
import { checkAvailability } from "../controllers/availability.controller";

const router = Router();

router.post("/check", checkAvailability);

export default router;
