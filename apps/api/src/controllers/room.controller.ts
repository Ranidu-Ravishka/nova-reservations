import type { Request, Response } from "express";
import { Room } from "../models/Room";

/* ---------------- CREATE ROOM ---------------- */
export const createRoom = async (req: Request, res: Response) => {
	try {
		const room = await Room.create(req.body);
		res.status(201).json(room);
	} catch (_error) {
		res.status(400).json({ message: "Failed to create room", _error });
	}
};

export const getRooms = async (req: Request, res: Response) => {
	const filter = req.query.hotelId ? { hotelId: req.query.hotelId } : {};

	const rooms = await Room.find(filter).populate("hotelId", "name");
	res.json(rooms);
};

/* ---------------- GET SINGLE ROOM ---------------- */
export const getRoomById = async (req: Request, res: Response) => {
	try {
		const room = await Room.findById(req.params.id).populate("hotelId");

		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}

		res.json(room);
	} catch (_error) {
		res.status(500).json({ message: "Failed to fetch room" });
	}
};

/* ---------------- UPDATE ROOM ---------------- */
export const updateRoom = async (req: Request, res: Response) => {
	try {
		const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		res.json(room);
	} catch (_error) {
		res.status(400).json({ message: "Failed to update room" });
	}
};

/* ---------------- DELETE ROOM ---------------- */
export const deleteRoom = async (req: Request, res: Response) => {
	try {
		await Room.findByIdAndDelete(req.params.id);
		res.json({ message: "Room deleted" });
	} catch (_error) {
		res.status(500).json({ message: "Failed to delete room" });
	}
};
