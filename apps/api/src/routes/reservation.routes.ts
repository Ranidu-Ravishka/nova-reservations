import { Router } from "express";
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
router.post("/", authenticate, authorize("CUSTOMER"), createReservation);

// STAFF + ADMIN manage reservations
router.get("/", authenticate, authorize("ADMIN", "STAFF"), getReservations);
router.put(
	"/:id",
	authenticate,
	authorize("ADMIN", "STAFF"),
	updateReservationStatus,
);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteReservation);

export default router;
