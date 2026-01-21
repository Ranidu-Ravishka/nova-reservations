import type { Request, Response } from "express";
import { Payment } from "../models/Payment";

export const createPayment = async (req: Request, res: Response) => {
	res.status(201).json(await Payment.create(req.body));
};

export const getPayments = async (_: Request, res: Response) => {
	res.json(await Payment.find().populate("reservationId"));
};
