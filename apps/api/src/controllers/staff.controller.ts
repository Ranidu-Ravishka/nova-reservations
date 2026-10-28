import type { Request, Response } from "express";
import { Staff } from "../models/Staff";

export const createStaff = async (req: Request, res: Response) => {
	res.status(201).json(await Staff.create(req.body));
};

export const getStaff = async (_: Request, res: Response) => {
	res.json(await Staff.find().populate("hotelId"));
};

export const updateStaff = async (req: Request, res: Response) => {
	const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!staff)
		return res.status(404).json({ message: "Staff member not found" });
	return res.json(staff);
};

export const deleteStaff = async (req: Request, res: Response) => {
	const staff = await Staff.findByIdAndDelete(req.params.id);
	if (!staff)
		return res.status(404).json({ message: "Staff member not found" });
	return res.json({ message: "Staff removed" });
};
