import type { Request, Response } from "express";
import { Types } from "mongoose";

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

	if (
		typeof transportId !== "string" ||
		!Types.ObjectId.isValid(transportId) ||
		typeof name !== "string" ||
		!name.trim() ||
		typeof email !== "string" ||
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
		typeof phone !== "string" ||
		!phone.trim()
	) {
		return res.status(400).json({
			message: "transportId, name, email and phone are required",
		});
	}

	const pickupDateValue =
		typeof pickupDate === "string" ? new Date(pickupDate) : undefined;
	if (
		(pickupDate !== undefined &&
			(typeof pickupDate !== "string" ||
				!pickupDateValue ||
				Number.isNaN(pickupDateValue.getTime()))) ||
		(passengers !== undefined &&
			(typeof passengers !== "number" ||
				!Number.isInteger(passengers) ||
				passengers < 1)) ||
		[pickupLocation, dropoffLocation, notes].some(
			(value) => value !== undefined && typeof value !== "string",
		)
	) {
		return res.status(400).json({ message: "Invalid transport request data" });
	}

	const transport = await Transport.findById(transportId);
	if (!transport) {
		return res.status(404).json({ message: "Transport service not found" });
	}

	const created = await TransportRequest.create({
		transportId,
		name: name.trim(),
		email: email.trim().toLowerCase(),
		phone: phone.trim(),
		pickupLocation:
			typeof pickupLocation === "string" ? pickupLocation.trim() : undefined,
		dropoffLocation:
			typeof dropoffLocation === "string" ? dropoffLocation.trim() : undefined,
		pickupDate: pickupDateValue,
		passengers,
		notes: typeof notes === "string" ? notes.trim() : undefined,
	});

	return res.status(201).json(created);
};

export const getTransportRequests = async (_: Request, res: Response) => {
	const requests = await TransportRequest.find()
		.populate("transportId", "type route")
		.sort({ createdAt: -1 });
	return res.json(requests);
};
