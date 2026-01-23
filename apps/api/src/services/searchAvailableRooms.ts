import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";

export async function searchAvailableRooms(
	hotelId: string,
	checkIn: Date,
	checkOut: Date,
	guests: number,
) {
	const rooms = await Room.find({
		hotelId,
		capacity: { $gte: guests },
	});

	const bookedRoomIds = await Reservation.distinct("roomId", {
		status: { $in: ["PENDING", "CONFIRMED"] },
		checkIn: { $lt: checkOut },
		checkOut: { $gt: checkIn },
	});

	return rooms.filter((room) => !bookedRoomIds.includes(room._id));
}
