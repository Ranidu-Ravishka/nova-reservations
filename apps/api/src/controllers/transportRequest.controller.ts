import type { Request, Response } from "express";

import { Transport } from "../models/Transport";
import { TransportRequest } from "../models/TransportRequest";

export const createTransportRequest = async (req: Request, res: Response) => {
	const {
		transportId,
		name,
		email,
		phone,
		pickupLocation,
		dropoffLocation,
		pickupDate,
		passengers,
		notes,
	} = req.body ?? {};

	if (!transportId || !name || !email || !phone) {
		return res.status(400).json({
			message: "transportId, name, email and phone are required",
		});
	}

	const transport = await Transport.findById(transportId);
	if (!transport) {
		return res.status(404).json({ message: "Transport service not found" });
	}

	const created = await TransportRequest.create({
		transportId,
		name,
		email,
		phone,
		pickupLocation,
		dropoffLocation,
		pickupDate: pickupDate ? new Date(pickupDate) : undefined,
		passengers,
		notes,
	});

	return res.status(201).json(created);
};

export const getTransportRequests = async (_: Request, res: Response) => {
	const requests = await TransportRequest.find().sort({ createdAt: -1 });
	return res.json(requests);
};
