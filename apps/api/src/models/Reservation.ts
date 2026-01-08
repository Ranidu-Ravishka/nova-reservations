import { model, Schema } from "mongoose";

const ReservationSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		roomId: { type: Schema.Types.ObjectId, ref: "Room" },
		checkIn: Date,
		checkOut: Date,
		totalPrice: Number,
		status: { type: String, default: "confirmed" },
	},
	{ timestamps: true },
);

export const Reservation = model("Reservation", ReservationSchema);
