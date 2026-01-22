import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { User } from "../models/User";
import { Room } from "../models/Room";
import { Reservation } from "../models/Reservation";

const router = Router();

router.get(
  "/dashboard",
  requireAuth,
  requireAdmin,
  async (_req, res) => {
    const [users, rooms, reservations] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      Reservation.countDocuments(),
    ]);

    res.json({
      stats: { users, rooms, reservations },
    });
  }
);

export default router;
