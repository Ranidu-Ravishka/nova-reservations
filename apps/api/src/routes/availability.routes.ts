import { Router } from "express";
import { getRoomAvailability } from "../controllers/availability.controller";

const router = Router();

router.get("/:roomId", getRoomAvailability);

export default router;
