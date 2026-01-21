import type { Request, Response } from "express";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { isRoomAvailable } from "../services/availability.service";

export const createReservation = async (req: Request, res: Response) => {
	const { roomId, checkIn, checkOut, userId } = req.body;

	if (new Date(checkIn) >= new Date(checkOut)) {
		return res.status(400).json({ message: "Invalid date range" });
	}

	// 🔒 Check availability
	const available = await isRoomAvailable(
		roomId,
		new Date(checkIn),
		new Date(checkOut),
	);

	if (!available) {
		return res.status(409).json({
			message: "Room is not available for selected dates",
		});
	}

	// 💰 Price calculation
	const room = await Room.findById(roomId);
	const nights =
		(new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
		(1000 * 60 * 60 * 24);

	const totalPrice = nights * (room?.pricePerNight || 0);

	const reservation = await Reservation.create({
		userId,
		roomId,
		checkIn,
		checkOut,
		totalPrice,
	});

	res.status(201).json(reservation);
};

export const getReservations = async (_: Request, res: Response) => {
	const reservations = await Reservation.find()
		.populate("roomId")
		.populate("userId");
	res.json(reservations);
};

export const updateReservationStatus = async (req: Request, res: Response) => {
	const reservation = await Reservation.findByIdAndUpdate(
		req.params.id,
		{ status: req.body.status },
		{ new: true },
	);
	res.json(reservation);
};

export const deleteReservation = async (req: Request, res: Response) => {
	await Reservation.findByIdAndDelete(req.params.id);
	res.json({ message: "Reservation cancelled" });
};
