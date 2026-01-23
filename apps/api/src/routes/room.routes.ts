import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createRoom,
	deleteRoom,
	getRoomById,
	getRooms,
	updateRoom,
} from "../controllers/room.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", requireAuth, authorize(Roles.ADMIN, Roles.STAFF), createRoom);
router.put(
	"/:id",
	requireAuth,
	authorize(Roles.ADMIN, Roles.STAFF),
	updateRoom,
);
router.delete("/:id", requireAuth, authorize(Roles.ADMIN), deleteRoom);
export default router;
