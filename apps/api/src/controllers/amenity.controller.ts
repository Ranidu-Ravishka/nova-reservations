import type { Request, Response } from "express";
import { Amenity } from "../models/Amenity";

export const createAmenity = async (req: Request, res: Response) => {
	res.status(201).json(await Amenity.create(req.body));
};

export const getAmenities = async (_: Request, res: Response) => {
	res.json(await Amenity.find());
};

export const deleteAmenity = async (req: Request, res: Response) => {
	const amenity = await Amenity.findByIdAndDelete(req.params.id);
	if (!amenity) return res.status(404).json({ message: "Amenity not found" });
	return res.json({ message: "Amenity deleted" });
};

export const updateAmenity = async (req: Request, res: Response) => {
	const amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!amenity) return res.status(404).json({ message: "Amenity not found" });
	return res.json(amenity);
};
