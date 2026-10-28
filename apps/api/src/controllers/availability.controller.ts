import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";

export const checkAvailability = async (req: Request, res: Response) => {
	const { roomTypeId, checkIn, checkOut } = req.body ?? {};

	if (
		typeof roomTypeId !== "string" ||
		!Types.ObjectId.isValid(roomTypeId) ||
		typeof checkIn !== "string" ||
		typeof checkOut !== "string"
	) {
		return res.status(400).json({ message: "Missing booking data" });
	}

	const checkInDate = new Date(checkIn);
	const checkOutDate = new Date(checkOut);
	if (
		Number.isNaN(checkInDate.getTime()) ||
		Number.isNaN(checkOutDate.getTime()) ||
		checkOutDate <= checkInDate
	) {
		return res.status(400).json({ message: "Invalid date range" });
	}

	const room = await Room.findById(roomTypeId);
	if (!room || !room.isActive) {
		return res.status(404).json({ message: "Room not found" });
	}

	const booked = await countOverlappingReservations(
		room._id.toString(),
		checkInDate,
		checkOutDate,
	);

	return res.json({
		availableRooms: room.totalRooms - booked,
	});
};
