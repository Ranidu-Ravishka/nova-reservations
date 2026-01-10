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

router.post("/", createRoom);
router.get("/", getRooms);
router.get("/:id", getRoomById);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);
router.post("/", authenticate, authorize("ADMIN", "STAFF"), createRoom);
router.put("/:id", authenticate, authorize("ADMIN", "STAFF"), updateRoom);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteRoom);

export default router;
