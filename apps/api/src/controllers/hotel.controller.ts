import type { Request, Response } from "express";
import { Hotel } from "../models/Hotel";

// CREATE hotel (Admin)
export const createHotel = async (req: Request, res: Response) => {
	try {
		const hotel = await Hotel.create(req.body);
		res.status(201).json(hotel);
	} catch (error) {
		res.status(400).json({ message: "Hotel creation failed", error });
	}
};

// GET all hotels (Web + Admin)
export const getHotels = async (_: Request, res: Response) => {
	const hotels = await Hotel.find();
	res.json(hotels);
};

// GET single hotel
export const getHotelById = async (req: Request, res: Response) => {
	try {
		const hotel = await Hotel.findById(req.params.id);

		if (!hotel) return res.status(404).json({ message: "Hotel not found" });
		res.json(hotel);
	} catch (error) {
		res.status(400).json({ message: "Failed to retrieve hotel", error });
	}
};

// UPDATE hotel (Admin)
export const updateHotel = async (req: Request, res: Response) => {
	const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(hotel);
};

// DELETE hotel (Admin)
export const deleteHotel = async (req: Request, res: Response) => {
	await Hotel.findByIdAndDelete(req.params.id);
	res.json({ message: "Hotel deleted" });
};
