import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createReservation,
	deleteReservation,
	getReservations,
	updateReservationStatus,
} from "../controllers/reservation.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

// CUSTOMER creates reservation
router.post("/", authenticate, authorize(Roles.CUSTOMER), createReservation);

// STAFF + ADMIN manage reservations
router.get(
	"/",
	authenticate,
	authorize(Roles.ADMIN, Roles.STAFF),
	getReservations,
);
router.put(
	"/:id",
	authenticate,
	authorize(Roles.ADMIN, Roles.STAFF),
	updateReservationStatus,
);
router.delete("/:id", authenticate, authorize(Roles.ADMIN), deleteReservation);

export default router;
