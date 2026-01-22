import { model, Schema } from "mongoose";

const ReservationSchema = new Schema(
	{
		/* 🔐 WHO BOOKED */
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		/* 🏨 HOTEL SNAPSHOT */
		hotelId: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		hotelName: {
			type: String,
			required: true,
		},

		/* 🛏 ROOM SNAPSHOT */
		roomId: {
			type: Schema.Types.ObjectId,
			ref: "Room",
			required: true,
		},
		roomName: {
			type: String,
			required: true,
		},
		roomType: {
			type: String,
			enum: ["DELUXE", "PREMIUM", "PRESIDENTIAL", "SUITE"],
			required: true,
		},

		roomsBooked: {
  type: Number,
  required: true,
  min: 1,
},


		/* 📅 DATES */
		checkIn: {
			type: Date,
			required: true,
		},
		checkOut: {
			type: Date,
			required: true,
		},
		nights: {
			type: Number,
			required: true,
		},

		/* 💰 PRICE SNAPSHOT */
		pricePerNight: {
			type: Number,
			required: true,
		},
		totalPrice: {
			type: Number,
			required: true,
		},

		/* 📌 STATUS */
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "CANCELLED"],
			default: "PENDING",
		},

		/* 💳 PAYMENT */
		paymentStatus: {
			type: String,
			enum: ["UNPAID", "PAID", "REFUNDED"],
			default: "UNPAID",
		},

		paymentId: String,
	},
	{ timestamps: true },
);

export const Reservation = model("Reservation", ReservationSchema);
