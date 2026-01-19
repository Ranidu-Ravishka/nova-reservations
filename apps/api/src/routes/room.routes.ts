import { Router } from "express";
import {
	createRoom,
	deleteRoom,
	getRoomById,
	getRooms,
	updateRoom,
} from "../controllers/room.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

/* ---------------- PUBLIC ---------------- */

// List rooms (optionally ?hotelId=)
router.get("/", getRooms);

// Single room
router.get("/:id", getRoomById);

/* ---------------- ADMIN / STAFF ---------------- */

// Create room
router.post("/", authenticate, authorize("ADMIN", "STAFF"), createRoom);

// Update room
router.put("/:id", authenticate, authorize("ADMIN", "STAFF"), updateRoom);

// Delete room (ADMIN only)
router.delete("/:id", authenticate, authorize("ADMIN"), deleteRoom);

export default router;
