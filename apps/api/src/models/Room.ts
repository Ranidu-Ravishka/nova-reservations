import { model, Schema } from "mongoose";

const RoomSchema = new Schema(
	{
		hotelId: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},

		name: { type: String, required: true },
		description: String,

		pricePerNight: { type: Number, required: true },
		size: String,
		occupancy: Number,

		amenities: {
			type: [String],
			default: [],
		},

		images: {
			hero: { type: String },
			listing: { type: String },
			gallery: {
				type: [String],
				default: [],
			},
		},

		isAvailable: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

export const Room = model("Room", RoomSchema);
