import type { Request, Response } from "express";
import { comparePassword, hashPassword } from "../../shared/utils/hash.ts";
import { generateToken } from "../../shared/utils/jwt.ts";
import User from "./user.model.ts";

export const register = async (
	req: Request<
		unknown,
		unknown,
		{ name: string; email: string; password: string }
	>,
	res: Response,
) => {
	const { name, email, password } = req.body;

	const exists = await User.findOne({ email });
	if (exists) {
		return res.status(400).json({ message: "User already exists" });
	}

	const hashedPassword = await hashPassword(password);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	});

	const token = generateToken({
		id: user._id,
		role: user.role,
	});

	res.status(201).json({ token });
};

export const login = async (
	req: Request<unknown, unknown, { email: string; password: string }>,
	res: Response,
) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const isMatch = await comparePassword(password, user.password);
	if (!isMatch) {
		return res.status(401).json({ message: "Invalid credentials" });
	}

	const token = generateToken({
		id: user._id,
		role: user.role,
	});

	res.json({ token });
};
