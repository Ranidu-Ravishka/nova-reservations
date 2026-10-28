import type { Request, Response } from "express";
import { Hotel } from "../models/Hotel";

// CREATE hotel
export const createHotel = async (req: Request, res: Response) => {
	const hotel = await Hotel.create(req.body);
	return res.status(201).json(hotel);
};

// GET all hotels
export const getHotels = async (_: Request, res: Response) => {
	const hotels = await Hotel.find();
	res.json(hotels);
};

// GET single hotel
export const getHotelById = async (req: Request, res: Response) => {
	const hotel = await Hotel.findById(req.params.id);
	if (!hotel) return res.status(404).json({ message: "Hotel not found" });
	res.json(hotel);
};

// UPDATE hotel
export const updateHotel = async (req: Request, res: Response) => {
	const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!hotel) return res.status(404).json({ message: "Hotel not found" });
	res.json(hotel);
};

// DELETE hotel
export const deleteHotel = async (req: Request, res: Response) => {
	const hotel = await Hotel.findByIdAndDelete(req.params.id);
	if (!hotel) return res.status(404).json({ message: "Hotel not found" });
	res.json({ message: "Hotel deleted" });
};
