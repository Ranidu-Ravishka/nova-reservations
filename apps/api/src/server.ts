import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.ts";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
	res.json({ status: "Nova Reservations API running" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`API running on port ${PORT}`);
});
