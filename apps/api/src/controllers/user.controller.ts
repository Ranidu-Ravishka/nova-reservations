import type { Request, Response } from "express";
import { UserModel } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
	const user = await UserModel.create(req.body);
	res.status(201).json(user);
};

export const getUsers = async (_: Request, res: Response) => {
	res.json(await UserModel.find());
};

export const updateUser = async (req: Request, res: Response) => {
	res.json(
		await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }),
	);
};

export const deleteUser = async (req: Request, res: Response) => {
	await UserModel.findByIdAndDelete(req.params.id);
	res.json({ message: "User deleted" });
};
