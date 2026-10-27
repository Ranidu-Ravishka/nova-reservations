import { Router } from "express";
import { Roles } from "../constants/roles";
import {
	createAmenity,
	deleteAmenity,
	getAmenities,
	updateAmenity,
} from "../controllers/amenity.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, authorize(Roles.ADMIN), createAmenity);
router.get("/", getAmenities);
router.put("/:id", requireAuth, authorize(Roles.ADMIN), updateAmenity);
router.delete("/:id", requireAuth, authorize(Roles.ADMIN), deleteAmenity);

export default router;
