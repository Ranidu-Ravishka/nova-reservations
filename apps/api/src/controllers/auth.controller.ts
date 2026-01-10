import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { Secret, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as unknown as
	| SignOptions["expiresIn"]
	| undefined;

const generateToken = (id: string, role: string) => {
	return jwt.sign({ id, role }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});
};

// REGISTER
export const register = async (req: Request, res: Response) => {
	const { name, email, password, role } = req.body;

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ message: "User already exists" });
	}

	const user = await User.create({ name, email, password, role });

	res.status(201).json({
		token: generateToken(user._id.toString(), user.role),
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	});
};

// LOGIN
export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(404).json({ message: "User not found" });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

	const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN ?? "1d",
	});

	res.json({
		token,
		role: user.role,
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
		},
	});
};
