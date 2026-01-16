import type { Request, Response } from "express";
import { Hotel} from "../models/Hotel";
import { Room} from "../models/Room";
import { Reservation} from "../models/Reservation";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalHotels = await Hotel.countDocuments();

    const availableRooms = await Room.countDocuments({
      isAvailable: true,
    });

    const activeReservations = await Reservation.countDocuments({
      status: "CONFIRMED",
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueAgg = await Reservation.aggregate([
      {
        $match: {
          status: "CONFIRMED",
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const monthlyRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalHotels,
      availableRooms,
      activeReservations,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
