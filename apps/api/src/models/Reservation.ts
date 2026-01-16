import { model, Schema } from "mongoose";

const ReservationSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
		checkIn: { type: Date, required: true },
		checkOut: { type: Date, required: true },
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["CONFIRMED", "CANCELLED"],
			default: "CONFIRMED",
		},
	},
	{ timestamps: true },
);

export const Reservation = model("Reservation", ReservationSchema);
