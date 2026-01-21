import type { Request, Response } from "express";
import { Reservation } from "../models/Reservation";

export const getRoomAvailability = async (req: Request, res: Response) => {
	const { roomId } = req.params;

	const reservations = await Reservation.find({
		roomId,
		status: "CONFIRMED",
	}).select("checkIn checkOut");

	res.json(reservations);
};

export const cancelReservation = async (req: Request, res: Response) => {
	const reservation = await Reservation.findByIdAndUpdate(
		req.params.id,
		{ status: "CANCELLED" },
		{ new: true },
	);

	res.json(reservation);
};
