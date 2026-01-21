import { model, Schema } from "mongoose";

const PaymentSchema = new Schema(
	{
		reservationId: { type: Schema.Types.ObjectId, ref: "Reservation" },
		amount: Number,
		method: String,
		status: String,
	},
	{ timestamps: true },
);

export const Payment = model("Payment", PaymentSchema);
