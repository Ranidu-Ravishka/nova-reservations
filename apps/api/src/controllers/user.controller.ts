import type { Request, Response } from "express";
import { User } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
	const user = await User.create(req.body);
	res.status(201).json(user);
};

export const getUsers = async (_: Request, res: Response) => {
	res.json(await User.find());
};

export const updateUser = async (req: Request, res: Response) => {
	res.json(
		await User.findByIdAndUpdate(req.params.id, req.body, { new: true }),
	);
};

export const deleteUser = async (req: Request, res: Response) => {
	await User.findByIdAndDelete(req.params.id);
	res.json({ message: "User deleted" });
};
