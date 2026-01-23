import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

/* ---------- LOGIN ---------- */
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password required" });
		}

		// 👇 explicitly include password
		const user = await UserModel.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// typed interface for user instance method
		interface UserWithMethods {
			comparePassword(password: string): Promise<boolean>;
		}

		const isMatch = await (user as unknown as UserWithMethods).comparePassword(
			password,
		);

		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return res.status(500).json({ message: "JWT secret not configured" });
		}

		const token = jwt.sign({ id: user._id, role: user.role }, secret, {
			expiresIn: "7d",
		});

		return res.json({
			token,
			role: user.role,
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};
