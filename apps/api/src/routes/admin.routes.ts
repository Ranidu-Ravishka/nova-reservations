import { Router } from "express";
import { requireAdmin } from "../middleware/admin.middleware";
import { requireAuth } from "../middleware/auth.middleware";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import User from "../models/User";

const router = Router();

router.get("/dashboard", requireAuth, requireAdmin, async (_req, res) => {
	const [users, rooms, reservations] = await Promise.all([
		User.countDocuments(),
		Room.countDocuments(),
		Reservation.countDocuments(),
	]);

	res.json({
		stats: { users, rooms, reservations },
	});
});

export default router;
