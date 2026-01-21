import { model, Schema } from "mongoose";

const HotelSchema = new Schema(
	{
		name: { type: String, required: true },
		location: {
			type: String,
			enum: ["Colombo", "Kandy", "Galle", "Nuwara Eliya"],
		},
		description: String,
		amenities: [String],
		images: [String],
	},
	{ timestamps: true },
);

export const Hotel = model("Hotel", HotelSchema);
