import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User"; // adjust path if needed

const router = Router();

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password required" });
		}

		const user = await UserModel.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) {
			console.error("Missing JWT_SECRET environment variable");
			return res.status(500).json({ message: "Server misconfiguration" });
		}

		const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
			expiresIn: "1d",
		});

		res.json({
			token,
			role: user.role,
			user: {
				id: user._id,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
