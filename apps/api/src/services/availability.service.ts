import { Types } from "mongoose";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";

const toObjectId = (value: string) =>
	Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

/**
 * Count total rooms booked overlapping with given dates
 */
export const countOverlappingReservations = async (
	roomId: string,
	checkIn: Date,
	checkOut: Date,
): Promise<number> => {
	const roomObjectId = toObjectId(roomId);
	if (!roomObjectId) return 0;
	if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
		return 0;
	}

	const result = await Reservation.aggregate([
		{
			$match: {
				roomId: roomObjectId,
				checkIn: { $lt: checkOut },
				checkOut: { $gt: checkIn },
				status: { $ne: "CANCELLED" },
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$roomsBooked" },
			},
		},
	]);

	return result[0]?.total ?? 0;
};

/**
 * Check if room has availability
 */
export const isRoomAvailable = async (
	roomId: string,
	checkIn: Date,
	checkOut: Date,
): Promise<boolean> => {
	const room = await Room.findById(roomId);
	if (!room || !room.isActive) return false;

	const booked = await countOverlappingReservations(roomId, checkIn, checkOut);

	return booked < room.totalRooms;
};
