import { Router } from "express";
import { Roles } from "../constants/roles";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { Hotel } from "../models/Hotel";
import { Payment } from "../models/Payment";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";

const router = Router();

/*
 * GET /api/admin/dashboard
 * Returns stats used by the Admin UI dashboard.
 */
router.get(
	"/dashboard",
	authenticate,
	authorize(Roles.ADMIN),
	async (_req, res) => {
		const now = new Date();
		const thirtyDaysAgo = new Date(now);
		thirtyDaysAgo.setDate(now.getDate() - 30);

		const [
			totalHotels,
			availableRoomsAgg,
			activeReservations,
			monthlyRevenueAgg,
		] = await Promise.all([
			Hotel.countDocuments({}),
			Room.aggregate([
				{ $match: { isActive: true } },
				{ $group: { _id: null, total: { $sum: "$totalRooms" } } },
			]),
			Reservation.countDocuments({
				status: { $in: ["PENDING", "CONFIRMED"] },
			}),
			Payment.aggregate([
				{
					$match: {
						status: "COMPLETED",
						createdAt: { $gte: thirtyDaysAgo },
					},
				},
				{ $group: { _id: null, total: { $sum: "$amount" } } },
			]),
		]);

		const availableRooms =
			(availableRoomsAgg?.[0]?.total as number | undefined) ?? 0;
		const monthlyRevenue =
			(monthlyRevenueAgg?.[0]?.total as number | undefined) ?? 0;

		res.json({
			totalHotels,
			availableRooms,
			activeReservations,
			monthlyRevenue,
		});
	},
);

export default router;
