import { Router } from "express";
import {
	createAmenity,
	deleteAmenity,
	getAmenities,
} from "../controllers/amenity.controller";

const router = Router();

router.post("/", createAmenity);
router.get("/", getAmenities);
router.delete("/:id", deleteAmenity);

export default router;
