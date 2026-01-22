import { Router } from "express";
import { Roles } from "../constants/roles";
import {
  createReservation,
  getReservations,
  updateReservation,
} from "../controllers/reservation.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

/* CUSTOMER */
router.post(
  "/",
  requireAuth,
  authorize(Roles.CUSTOMER),
  createReservation
);

/* ADMIN / STAFF */
router.get(
  "/",
  requireAuth,
  authorize(Roles.ADMIN, Roles.STAFF),
  getReservations
);

router.put(
  "/:id",
  requireAuth,
  authorize(Roles.ADMIN, Roles.STAFF),
  updateReservation
);

export default router;
