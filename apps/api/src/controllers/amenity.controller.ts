import type { Request, Response } from "express";
import { Amenity } from "../models/Amenity";

export const createAmenity = async (req: Request, res: Response) => {
	res.status(201).json(await Amenity.create(req.body));
};

export const getAmenities = async (_: Request, res: Response) => {
	res.json(await Amenity.find());
};

export const deleteAmenity = async (req: Request, res: Response) => {
	await Amenity.findByIdAndDelete(req.params.id);
	res.json({ message: "Amenity deleted" });
};
