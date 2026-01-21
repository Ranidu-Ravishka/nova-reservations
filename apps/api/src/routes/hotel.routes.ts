import { Router } from "express";
import {
	createHotel,
	deleteHotel,
	getHotelById,
	getHotels,
	updateHotel,
} from "../controllers/hotel.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", authenticate, authorize("ADMIN"), createHotel);
router.put("/:id", authenticate, authorize("ADMIN"), updateHotel);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteHotel);

export default router;
