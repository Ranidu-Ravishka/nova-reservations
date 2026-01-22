import { Router } from "express";
import {  } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import { UserModel } from "../models/User";
import { Room } from "../models/Room";
import { Reservation } from "../models/Reservation";
import { requireAuth } from "../middlewares/auth.middleware";



const router = Router();

/* GET /api/admin/dashboard */
router.get(
	"/dashboard",
	requireAuth,
	async (req, res) => {
		const admins = await UserModel.find({ role: "ADMIN" });
		res.json(admins);
	}
);


/* ---------- ADMIN DASHBOARD ---------- */
router.get("/dashboard", UserModel, requireAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin",
    stats: {
      users: 120,
      bookings: 45,
      revenue: 12340,
    },
  });
});

export default router;
