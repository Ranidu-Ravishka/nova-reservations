import { model, Schema } from "mongoose";

const PaymentSchema = new Schema(
	{
		reservationId: {
			type: Schema.Types.ObjectId,
			ref: "Reservation",
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		paypalPaymentId: { type: String, required: true },
		payerId: { type: String },
		amount: { type: Number, required: true },
		currency: { type: String, default: "USD" },
		method: { type: String, default: "PAYPAL" },
		status: {
			type: String,
			enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
			default: "PENDING",
		},
	},
	{ timestamps: true },
);

export const Payment = model("Payment", PaymentSchema);
