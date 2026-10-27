import type { Request, Response } from "express";
import { Roles } from "../constants/roles";
import { UserModel } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
	const { name, email, password, role = Roles.CUSTOMER } = req.body;

	if (
		typeof name !== "string" ||
		!name.trim() ||
		typeof email !== "string" ||
		!email.trim() ||
		typeof password !== "string" ||
		password.length < 8 ||
		!Object.values(Roles).some((validRole) => validRole === role)
	) {
		return res.status(400).json({ message: "Invalid user data" });
	}

	const user = await UserModel.create({
		name: name.trim(),
		email: email.trim().toLowerCase(),
		password,
		role,
	});

	return res.status(201).json({
		_id: user._id.toString(),
		name: user.name,
		email: user.email,
		role: user.role,
	});
};

export const getUsers = async (_: Request, res: Response) => {
	res.json(await UserModel.find().select("-password"));
};

export const updateUser = async (req: Request, res: Response) => {
	const updates: { name?: string; email?: string } = {};
	const { name, email } = req.body;

	if (name !== undefined) {
		if (typeof name !== "string" || !name.trim()) {
			return res.status(400).json({ message: "Invalid name" });
		}
		updates.name = name.trim();
	}

	if (email !== undefined) {
		if (typeof email !== "string" || !email.trim()) {
			return res.status(400).json({ message: "Invalid email" });
		}
		updates.email = email.trim().toLowerCase();
	}

	if (Object.keys(updates).length === 0) {
		return res
			.status(400)
			.json({ message: "No editable user fields provided" });
	}

	const user = await UserModel.findByIdAndUpdate(req.params.id, updates, {
		new: true,
		runValidators: true,
	}).select("-password");

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	return res.json(user);
};

export const updateUserRole = async (req: Request, res: Response) => {
	const { role } = req.body;

	if (
		typeof role !== "string" ||
		!Object.values(Roles).some((validRole) => validRole === role)
	) {
		return res.status(400).json({ message: "Invalid role" });
	}

	const user = await UserModel.findByIdAndUpdate(
		req.params.id,
		{ role },
		{ new: true, runValidators: true },
	).select("-password");

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	return res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
	const user = await UserModel.findByIdAndDelete(req.params.id);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	return res.json({ message: "User deleted" });
};
