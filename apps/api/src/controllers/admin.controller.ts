import type { Request, Response } from "express";
import { Hotel } from "../models/Hotel";
import { Payment } from "../models/Payment";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { UserModel } from "../models/User";

export const getDashboardStats = async (_req: Request, res: Response) => {
	try {
		const startOfToday = new Date();
		startOfToday.setUTCHours(0, 0, 0, 0);
		const startOfTomorrow = new Date(startOfToday);
		startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

		const startOfMonth = new Date();
		startOfMonth.setUTCDate(1);
		startOfMonth.setUTCHours(0, 0, 0, 0);

		const [
			totalHotels,
			roomCounts,
			roomTypes,
			activeReservations,
			totalReservations,
			totalUsers,
			revenueTotals,
		] = await Promise.all([
			Hotel.countDocuments(),
			Room.aggregate([
				{ $match: { isActive: true } },
				{
					$group: {
						_id: null,
						total: { $sum: "$totalRooms" },
						roomIds: { $addToSet: "$_id" },
					},
				},
			]),
			Room.countDocuments(),
			Reservation.countDocuments({
				status: { $ne: "CANCELLED" },
				checkOut: { $gt: startOfToday },
			}),
			Reservation.countDocuments(),
			UserModel.countDocuments(),
			Payment.aggregate([
				{
					$match: {
						status: "PAID",
						currency: "USD",
						createdAt: { $gte: startOfMonth },
					},
				},
				{ $group: { _id: null, total: { $sum: "$amount" } } },
			]),
		]);

		const activeRoomIds = roomCounts[0]?.roomIds ?? [];
		const occupiedRooms = activeRoomIds.length
			? await Reservation.aggregate([
					{
						$match: {
							roomId: { $in: activeRoomIds },
							status: { $ne: "CANCELLED" },
							checkIn: { $lt: startOfTomorrow },
							checkOut: { $gt: startOfToday },
						},
					},
					{ $group: { _id: null, total: { $sum: "$roomsBooked" } } },
				])
			: [];
		const availableRooms = Math.max(
			0,
			(roomCounts[0]?.total ?? 0) - (occupiedRooms[0]?.total ?? 0),
		);
		const monthlyRevenue = revenueTotals[0]?.total ?? 0;

		res.json({
			stats: {
				users: totalUsers,
				rooms: roomTypes,
				reservations: totalReservations,
			},
			totalHotels,
			availableRooms,
			activeReservations,
			monthlyRevenue,
		});
	} catch (error) {
		console.error("Get dashboard stats error:", error);
		res.status(500).json({ message: "Failed to load dashboard stats" });
	}
};
