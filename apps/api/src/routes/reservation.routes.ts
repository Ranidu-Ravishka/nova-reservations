import { Router } from "express";
import {
	createReservation,
	deleteReservation,
	getReservations,
	updateReservationStatus,
} from "../controllers/reservation.controller";
import { adminOnly, protect } from "../middlewares/auth.middleware";

const router = Router();

// Customer
router.post("/", protect, createReservation);

// Admin
router.get("/", protect, adminOnly, getReservations);
router.put("/:id", protect, adminOnly, updateReservationStatus);
router.delete("/:id", protect, adminOnly, deleteReservation);

export default router;
