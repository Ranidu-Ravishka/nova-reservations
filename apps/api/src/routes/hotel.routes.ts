import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createHotel,
	deleteHotel,
	getHotelById,
	getHotels,
	updateHotel,
} from "../controllers/hotel.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", requireAuth, authorize(Roles.ADMIN), createHotel);
router.put("/:id", requireAuth, authorize(Roles.ADMIN), updateHotel);
router.delete("/:id", requireAuth, authorize(Roles.ADMIN), deleteHotel);

export default router;
