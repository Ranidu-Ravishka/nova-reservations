import { model, Schema } from "mongoose";

const HotelSchema = new Schema(
	{
		name: { type: String, required: true },

		location: {
			type: String,
			enum: ["Colombo", "Kandy", "Galle", "Nuwara Eliya"],
			required: true,
		},

		description: String,

		amenities: {
			type: [String],
			default: [],
		},

		images: {
			shared: {
				type: [String],
				default: [],
			},
			unique: {
				type: [String],
				default: [],
			},
		},

		coordinates: {
			lat: { type: Number, required: true },
			lng: { type: Number, required: true },
		},
	},
	{ timestamps: true },
);

export const Hotel = model("Hotel", HotelSchema);
