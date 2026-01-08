import type { Request, Response } from "express";
import { Staff } from "../models/Staff";

export const createStaff = async (req: Request, res: Response) => {
	res.status(201).json(await Staff.create(req.body));
};

export const getStaff = async (_: Request, res: Response) => {
	res.json(await Staff.find().populate("hotelId"));
};

export const updateStaff = async (req: Request, res: Response) => {
	res.json(
		await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true }),
	);
};

export const deleteStaff = async (req: Request, res: Response) => {
	await Staff.findByIdAndDelete(req.params.id);
	res.json({ message: "Staff removed" });
};
