import { Router } from "express";
import {
	createAmenity,
	deleteAmenity,
	getAmenities,
	updateAmenity,
} from "../controllers/amenity.controller";

const router = Router();

router.post("/", createAmenity);
router.get("/", getAmenities);
router.put("/:id", updateAmenity);
router.delete("/:id", deleteAmenity);

export default router;
