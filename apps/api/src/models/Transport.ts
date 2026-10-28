import { model, Schema } from "mongoose";

const TransportSchema = new Schema(
	{
		type: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 },
		route: { type: String, required: true, trim: true },
		capacity: {
			type: Number,
			required: true,
			min: 1,
			validate: Number.isInteger,
		},
	},
	{ timestamps: true },
);

export const Transport = model("Transport", TransportSchema);
