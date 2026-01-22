import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createReservation,
	getReservations,
	updateReservation,
} from "../controllers/reservation.controller";
import { UserModel } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// CUSTOMER → create reservation (PENDING / HOLD)
router.post("/", UserModel, authorize(Roles.CUSTOMER), createReservation);

// ADMIN / STAFF → view all reservations
router.get("/", UserModel, authorize("ADMIN", "STAFF"), getReservations);

// ADMIN / STAFF → update reservation status
router.put("/:id", UserModel, authorize("ADMIN", "STAFF"), updateReservation);

export default router;
