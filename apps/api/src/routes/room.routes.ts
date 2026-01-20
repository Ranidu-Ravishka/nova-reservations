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

router.get("/", getRooms); // ?hotelId=
router.get("/:id", getRoomById);

router.post("/", authenticate, authorize("ADMIN"), createRoom);
router.put("/:id", authenticate, authorize("ADMIN"), updateRoom);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteRoom);
export default router;
