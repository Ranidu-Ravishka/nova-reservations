import type { Request, Response } from "express";
import paypal from "paypal-rest-sdk";
import { Reservation } from "../models/Reservation";

/* ---------------- LOCAL PAYPAL TYPES ---------------- */

type PayPalLink = {
	href: string;
	rel: string;
	method?: string;
};

type PayPalPayment = {
	id: string;
	links?: PayPalLink[];
};

/* ---------------- PAYPAL CONFIG ---------------- */

paypal.configure({
	mode: "sandbox",
	client_id: process.env.PAYPAL_CLIENT_ID as string,
	client_secret: process.env.PAYPAL_CLIENT_SECRET as string,
});

/* ---------------- CREATE PAYPAL PAYMENT ---------------- */

export const createPayment = async (req: Request, res: Response) => {
	try {
		const { reservationId } = req.body;

		if (!reservationId) {
			return res.status(400).json({ message: "Reservation ID required" });
		}

		const reservation = await Reservation.findById(reservationId);
		if (!reservation) {
			return res.status(404).json({ message: "Reservation not found" });
		}

		if (reservation.status !== "PENDING") {
			return res.status(400).json({ message: "Reservation is not payable" });
		}

		const paymentJson = {
			intent: "sale",
			payer: {
				payment_method: "paypal",
			},
			redirect_urls: {
				return_url: `http://localhost:3000/payment/success?reservation=${reservation._id}`,
				cancel_url: "http://localhost:3000/payment/cancel",
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

		// paypal-rest-sdk has no types; use `unknown` instead of `any`
		paypal.payment.create(paymentJson, (error: unknown, payment: unknown) => {
			if (error) {
				console.error("PayPal create error:", error);
				return res
					.status(500)
					.json({ message: "PayPal payment creation failed" });
			}

			const typedPayment = payment as PayPalPayment;

			const approvalUrl = typedPayment.links?.find(
				(link) => link.rel === "approval_url",
			);

			if (!approvalUrl) {
				return res.status(500).json({ message: "Approval URL not found" });
			}

			return res.json({ approvalUrl: approvalUrl.href });
		});
	} catch (error) {
		console.error("Create payment error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

/* ---------------- EXECUTE PAYPAL PAYMENT ---------------- */

export const executePayment = async (req: Request, res: Response) => {
	try {
		const { paymentId, PayerID, reservationId } = req.body;

		if (!paymentId || !PayerID || !reservationId) {
			return res.status(400).json({ message: "Missing parameters" });
		}

		paypal.payment.execute(
			paymentId,
			{ payer_id: PayerID },
			async (error: unknown, _payment: unknown) => {
				if (error) {
					console.error("PayPal execute error:", error);
					return res.status(500).json({ message: "Payment execution failed" });
				}

				const reservation = await Reservation.findById(reservationId);
				if (!reservation) {
					return res.status(404).json({ message: "Reservation not found" });
				}

				if (reservation.status !== "PENDING") {
					return res.status(400).json({ message: "Invalid reservation state" });
				}

				// ✅ CONFIRM RESERVATION
				reservation.status = "CONFIRMED";
				await reservation.save();

				return res.json({
					message: "Payment successful, reservation confirmed",
				});
			},
		);
	} catch (error) {
		console.error("Execute payment error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

/* ---------------- ADMIN: GET PAYMENTS ---------------- */

export const getPayments = async (_req: Request, res: Response) => {
	const payments = await Reservation.find({ status: "CONFIRMED" })
		.populate({
			path: "roomTypeId",
			populate: { path: "hotelId" },
		})
		.populate("userId")
		.sort({ createdAt: -1 });

	res.json(payments);
};
