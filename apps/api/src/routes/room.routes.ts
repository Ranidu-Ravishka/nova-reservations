import { Router } from "express";
import { Roles } from "../constants/roles";
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

router.post("/", authenticate, authorize(Roles.ADMIN), createRoom);
router.put("/:id", authenticate, authorize(Roles.ADMIN), updateRoom);
router.delete("/:id", authenticate, authorize(Roles.ADMIN), deleteRoom);
export default router;
