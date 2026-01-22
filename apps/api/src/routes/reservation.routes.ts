import { Router } from "express";
import {
	createReservation,
	getReservations,
} from "../controllers/reservation.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// CUSTOMER → create reservation (PENDING / HOLD)
router.post("/", authenticate, authorize("CUSTOMER"), createReservation);

// ADMIN / STAFF → view all reservations
router.get("/", authenticate, authorize("ADMIN", "STAFF"), getReservations);

export default router;
