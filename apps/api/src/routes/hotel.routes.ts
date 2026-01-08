import { Router } from "express";
import {
	createHotel,
	deleteHotel,
	getHotelById,
	getHotels,
	updateHotel,
} from "../controllers/hotel.controller";
import { adminOnly, protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getHotels);
router.get("/:id", getHotelById);

// Admin protected
router.post("/", protect, adminOnly, createHotel);
router.put("/:id", protect, adminOnly, updateHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);

export default router;
