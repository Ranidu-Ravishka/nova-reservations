import { model, Schema } from "mongoose";

const TransportSchema = new Schema(
	{
		type: String,
		price: Number,
		route: String,
		capacity: Number,
	},
	{ timestamps: true },
);

export const Transport = model("Transport", TransportSchema);
