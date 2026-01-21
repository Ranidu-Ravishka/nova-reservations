import { Reservation } from "../models/Reservation";

export const isRoomAvailable = async (
	roomId: string,
	checkIn: Date,
	checkOut: Date,
) => {
	const conflict = await Reservation.findOne({
		roomId,
		status: "CONFIRMED",
		checkIn: { $lt: checkOut },
		checkOut: { $gt: checkIn },
	});

	return !conflict; // true if available
};
