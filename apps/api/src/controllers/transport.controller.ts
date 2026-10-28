import type { Request, Response } from "express";
import { Transport } from "../models/Transport";

export const createTransport = async (req: Request, res: Response) => {
	const service = await Transport.create(req.body);
	res.status(201).json(service);
};

export const getTransports = async (_: Request, res: Response) => {
	const services = await Transport.find();
	res.json(services);
};

export const updateTransport = async (req: Request, res: Response) => {
	const service = await Transport.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!service) {
		return res.status(404).json({ message: "Transport service not found" });
	}
	res.json(service);
};

export const deleteTransport = async (req: Request, res: Response) => {
	const service = await Transport.findByIdAndDelete(req.params.id);
	if (!service) {
		return res.status(404).json({ message: "Transport service not found" });
	}
	res.json({ message: "Transport service deleted" });
};
