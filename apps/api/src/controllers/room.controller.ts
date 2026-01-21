import type { Request, Response } from "express";
import { Room } from "../models/Room";

// CREATE room
export const createRoom = async (req: Request, res: Response) => {
	const room = await Room.create(req.body);
	res.status(201).json(room);
};

// GET rooms (optionally by hotel)
export const getRooms = async (req: Request, res: Response) => {
	const filter = req.query.hotelId ? { hotelId: req.query.hotelId } : {};
	const rooms = await Room.find(filter).populate("hotelId");
	res.json(rooms);
};

// GET single room
export const getRoomById = async (req: Request, res: Response) => {
	const room = await Room.findById(req.params.id).populate("hotelId");
	res.json(room);
};

// UPDATE room
export const updateRoom = async (req: Request, res: Response) => {
	const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(room);
};

// DELETE room
export const deleteRoom = async (req: Request, res: Response) => {
	await Room.findByIdAndDelete(req.params.id);
	res.json({ message: "Room deleted" });
};
