import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createHotel,
	deleteHotel,
	getHotelById,
	getHotels,
	updateHotel,
} from "../controllers/hotel.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", authenticate, authorize(Roles.ADMIN), createHotel);
router.put("/:id", authenticate, authorize(Roles.ADMIN), updateHotel);
router.delete("/:id", authenticate, authorize(Roles.ADMIN), deleteHotel);

export default router;
