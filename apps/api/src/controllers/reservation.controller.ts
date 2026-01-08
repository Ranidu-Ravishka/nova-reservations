import type { Request, Response } from "express";
import { Reservation } from "../models/Reservation";

export const createReservation = async (req: Request, res: Response) => {
	const reservation = await Reservation.create(req.body);
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
