import type { Request, Response } from "express";
import { Types } from "mongoose";
import paypal from "paypal-rest-sdk";
import type { AuthRequest } from "../middleware/auth.middleware";
import { Payment } from "../models/Payment";
import { Reservation } from "../models/Reservation";
import { Room } from "../models/Room";
import { countOverlappingReservations } from "../services/availability.service";
import {
	capturePayPalOrder,
	createPayPalOrder,
	isLegacyPaymentApproved,
	isPayPalOrderCaptured,
} from "../services/paypal.service";
import { getIO } from "../socket";

/* ---------------- PAYPAL CONFIG ---------------- */

paypal.configure({
	mode: process.env.PAYPAL_MODE || "sandbox",
	client_id: process.env.PAYPAL_CLIENT_ID as string,
	client_secret: process.env.PAYPAL_CLIENT_SECRET as string,
});

const WEB_BASE_URL = process.env.WEB_BASE_URL || "http://localhost:3000";

type PayPalLink = {
	rel?: string;
	href?: string;
};

type PayPalPayment = {
	id?: string;
	state?: string;
	links?: PayPalLink[];
};

type PayPalOrder = {
	id?: string;
};

/* ---------------- CREATE PAYPAL PAYMENT ---------------- */

export const createPayment = async (req: AuthRequest, res: Response) => {
	try {
		const { reservationId } = req.body ?? {};

		if (
			typeof reservationId !== "string" ||
			!Types.ObjectId.isValid(reservationId)
		) {
			return res.status(400).json({ message: "Reservation ID required" });
		}

		const reservation = await Reservation.findById(reservationId);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const userId = req.user?.id;
		const role = req.user?.role?.toUpperCase();
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (
			reservation.userId.toString() !== userId &&
			!["ADMIN", "STAFF"].includes(role || "")
		) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (
			reservation.status !== "PENDING" ||
			reservation.paymentStatus !== "UNPAID"
		) {
			return res.status(400).json({ message: "Reservation is not payable" });
		}

		const paymentJson = {
			intent: "sale",
			payer: { payment_method: "paypal" },
			redirect_urls: {
				return_url: `${WEB_BASE_URL}/payments/success?reservation=${reservation._id}`,
				cancel_url: `${WEB_BASE_URL}/payments/cancel?reservation=${reservation._id}`,
			},
			transactions: [
				{
					amount: {
						total: reservation.totalPrice.toFixed(2),
						currency: "USD",
					},
					description: "Nova Hotel Reservation",
				},
			],
		};

		paypal.payment.create(
			paymentJson,
			async (error: unknown, payment: PayPalPayment) => {
				try {
					if (error) {
						console.error("PayPal create error:", error);
						return res.status(500).json({ message: "PayPal payment failed" });
					}

					const approval = payment?.links?.find(
						(link) => link?.rel === "approval_url",
					);

					if (!approval?.href || !payment?.id) {
						return res.status(500).json({ message: "Approval URL not found" });
					}

					reservation.paymentId = payment.id;
					await reservation.save();

					await Payment.create({
						reservationId: reservation._id,
						userId: reservation.userId,
						paypalPaymentId: payment.id,
						amount: reservation.totalPrice,
						currency: "USD",
						method: "PAYPAL",
						status: "PENDING",
					});

					return res.json({ approvalUrl: approval.href });
				} catch (callbackError) {
					console.error("PayPal payment initialization error:", callbackError);
					if (!res.headersSent) {
						return res
							.status(500)
							.json({ message: "PayPal payment initialization failed" });
					}
				}
			},
		);
	} catch (err) {
		console.error("Create payment error:", err);
		return res.status(500).json({ message: "Server error" });
	}
};

/* ---------------- EXECUTE PAYPAL PAYMENT ---------------- */

export const executePayment = async (req: AuthRequest, res: Response) => {
	try {
		const { paymentId, PayerID, reservationId } = req.body ?? {};

		if (
			typeof paymentId !== "string" ||
			!paymentId ||
			typeof PayerID !== "string" ||
			!PayerID ||
			typeof reservationId !== "string" ||
			!Types.ObjectId.isValid(reservationId)
		) {
			return res.status(400).json({ message: "Missing payment data" });
		}

		const reservation = await Reservation.findById(reservationId);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const userId = req.user?.id;
		const role = req.user?.role?.toUpperCase();
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (
			reservation.userId.toString() !== userId &&
			!["ADMIN", "STAFF"].includes(role || "")
		) {
			return res.status(403).json({ message: "Access denied" });
		}
		if (!reservation.paymentId || reservation.paymentId !== paymentId) {
			return res
				.status(400)
				.json({ message: "Payment does not match reservation" });
		}
		const paymentRecord = await Payment.findOne({
			reservationId: reservation._id,
			paypalPaymentId: paymentId,
			status: "PENDING",
		});
		if (!paymentRecord) {
			return res.status(409).json({ message: "Payment is not pending" });
		}
		if (reservation.status !== "PENDING") {
			return res.status(400).json({ message: "Invalid reservation state" });
		}
		if (reservation.paymentStatus !== "UNPAID") {
			return res.status(409).json({ message: "Reservation is not unpaid" });
		}

		const room = await Room.findById(reservation.roomId);
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}
		const bookedBeforePayment = await countOverlappingReservations(
			room._id.toString(),
			reservation.checkIn,
			reservation.checkOut,
		);
		const otherRoomsBooked = Math.max(
			0,
			bookedBeforePayment - reservation.roomsBooked,
		);
		if (room.totalRooms - otherRoomsBooked < reservation.roomsBooked) {
			return res.status(409).json({
				message: "Rooms sold out during payment processing",
			});
		}

		paypal.payment.execute(
			paymentId,
			{ payer_id: PayerID },
			async (error: unknown, payment: unknown) => {
				try {
					if (error) {
						console.error("PayPal execute error:", error);
						await Payment.findOneAndUpdate(
							{ _id: paymentRecord._id, status: "PENDING" },
							{ status: "FAILED" },
						);
						return res
							.status(500)
							.json({ message: "Payment execution failed" });
					}

					if (!isLegacyPaymentApproved(payment, reservation.totalPrice)) {
						return res.status(409).json({
							message: "PayPal payment is not completed for this amount",
						});
					}

					const room = await Room.findById(reservation.roomId);
					if (!room) {
						return res.status(404).json({ message: "Room not found" });
					}

					const booked = await countOverlappingReservations(
						room._id.toString(),
						reservation.checkIn,
						reservation.checkOut,
					);
					const otherBooked = Math.max(0, booked - reservation.roomsBooked);
					const remaining = room.totalRooms - otherBooked;
					if (remaining < reservation.roomsBooked) {
						return res.status(409).json({
							message: "Rooms sold out during payment processing",
						});
					}

					reservation.status = "CONFIRMED";
					reservation.paymentStatus = "PAID";
					await reservation.save();

					await Payment.findOneAndUpdate(
						{ _id: paymentRecord._id, status: "PENDING" },
						{ status: "PAID", payerId: PayerID },
						{ new: true },
					);

					const io = getIO();
					io.emit("availability:update", {
						roomId: room._id.toString(),
						remaining: room.totalRooms - booked,
					});
					io.emit("reservation:status", {
						id: reservation._id.toString(),
						status: reservation.status,
					});

					return res.json({
						message: "Payment successful. Reservation confirmed.",
					});
				} catch (callbackError) {
					console.error("PayPal payment processing error:", callbackError);
					if (!res.headersSent) {
						return res
							.status(500)
							.json({ message: "Payment processing failed" });
					}
				}
			},
		);
	} catch (err) {
		console.error("Execute payment error:", err);
		return res.status(500).json({ message: "Server error" });
	}
};

/* ---------------- PAYPAL ORDER (JS SDK) ---------------- */

export const createOrder = async (req: AuthRequest, res: Response) => {
	try {
		const { reservationId } = (req.body ?? {}) as {
			reservationId?: string;
		};
		if (
			typeof reservationId !== "string" ||
			!Types.ObjectId.isValid(reservationId)
		) {
			return res.status(400).json({ message: "Reservation ID required" });
		}

		const reservation = await Reservation.findById(reservationId);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const userId = req.user?.id;
		const role = req.user?.role?.toUpperCase();
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (
			reservation.userId.toString() !== userId &&
			!["ADMIN", "STAFF"].includes(role || "")
		) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (
			reservation.status !== "PENDING" ||
			reservation.paymentStatus !== "UNPAID"
		) {
			return res.status(400).json({ message: "Reservation is not payable" });
		}

		const order = (await createPayPalOrder(
			reservation.totalPrice,
		)) as PayPalOrder;

		if (!order?.id) {
			return res.status(500).json({ message: "Failed to create PayPal order" });
		}

		reservation.paymentId = order.id;
		await reservation.save();

		await Payment.findOneAndUpdate(
			{ reservationId: reservation._id },
			{
				reservationId: reservation._id,
				userId: reservation.userId,
				paypalPaymentId: order.id,
				amount: reservation.totalPrice,
				currency: "USD",
				method: "PAYPAL",
				status: "PENDING",
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);

		return res.json({ id: order.id });
	} catch (err) {
		console.error("Create PayPal order error:", err);
		return res.status(500).json({ message: "Failed to create PayPal order" });
	}
};

export const captureOrder = async (req: AuthRequest, res: Response) => {
	try {
		const { orderId, reservationId } = (req.body ?? {}) as {
			orderId?: string;
			reservationId?: string;
		};

		if (
			typeof orderId !== "string" ||
			!orderId ||
			typeof reservationId !== "string" ||
			!Types.ObjectId.isValid(reservationId)
		) {
			return res.status(400).json({ message: "Missing capture data" });
		}

		const reservation = await Reservation.findById(reservationId);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		const userId = req.user?.id;
		const role = req.user?.role?.toUpperCase();
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (
			reservation.userId.toString() !== userId &&
			!["ADMIN", "STAFF"].includes(role || "")
		) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (!reservation.paymentId || reservation.paymentId !== orderId) {
			return res
				.status(400)
				.json({ message: "Order does not match reservation" });
		}
		const paymentRecord = await Payment.findOne({
			reservationId: reservation._id,
			paypalPaymentId: orderId,
			status: "PENDING",
		});
		if (!paymentRecord) {
			return res.status(409).json({ message: "Payment is not pending" });
		}

		if (reservation.status !== "PENDING") {
			return res.status(400).json({ message: "Invalid reservation state" });
		}
		if (reservation.paymentStatus !== "UNPAID") {
			return res.status(409).json({ message: "Reservation is not unpaid" });
		}

		const room = await Room.findById(reservation.roomId);
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}

		const booked = await countOverlappingReservations(
			room._id.toString(),
			reservation.checkIn,
			reservation.checkOut,
		);

		const otherBooked = Math.max(0, booked - reservation.roomsBooked);
		const remaining = room.totalRooms - otherBooked;
		if (remaining < reservation.roomsBooked) {
			return res.status(409).json({
				message: "Rooms sold out during payment processing",
			});
		}

		try {
			const capture = await capturePayPalOrder(orderId);
			if (!isPayPalOrderCaptured(capture, reservation.totalPrice)) {
				return res
					.status(409)
					.json({ message: "PayPal order is not completed for this amount" });
			}
		} catch (error) {
			console.error("PayPal capture error:", error);
			await Payment.findOneAndUpdate(
				{ _id: paymentRecord._id, status: "PENDING" },
				{ status: "FAILED" },
			);
			return res.status(500).json({ message: "Payment capture failed" });
		}

		reservation.status = "CONFIRMED";
		reservation.paymentStatus = "PAID";
		reservation.paymentId = orderId;
		await reservation.save();

		await Payment.findOneAndUpdate(
			{ _id: paymentRecord._id, status: "PENDING" },
			{ status: "PAID" },
			{ new: true },
		);

		const io = getIO();
		io.emit("availability:update", {
			roomId: room._id.toString(),
			remaining,
		});
		io.emit("reservation:status", {
			id: reservation._id.toString(),
			status: reservation.status,
		});

		return res.json({ message: "Payment captured. Reservation confirmed." });
	} catch (err) {
		console.error("Capture PayPal order error:", err);
		return res.status(500).json({ message: "Failed to capture PayPal order" });
	}
};

/* ---------------- ADMIN: GET PAYMENTS ---------------- */

export const getPayments = async (_req: Request, res: Response) => {
	const payments = await Payment.find()
		.populate("userId", "name email")
		.populate("reservationId")
		.sort({ createdAt: -1 });

	res.json(payments);
};
