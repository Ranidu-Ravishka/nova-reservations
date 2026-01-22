import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";

/**
 * Count total rooms booked overlapping with given dates
 */
export const countOverlappingReservations = async (
	roomId: string,
	checkIn: Date,
	checkOut: Date,
): Promise<number> => {
	const result = await Reservation.aggregate([
		{
			$match: {
				roomId,
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
