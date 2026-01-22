import { model, Schema } from "mongoose";

const RoomSchema = new Schema(
	{
		name: { type: String, required: true },

		type: {
			type: String,
			enum: ["DELUXE", "PREMIUM", "PRESIDENTIAL", "SUITE"],
			required: true,
		},

		description: { type: String },

		hotelId: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},

		totalRooms: {
			type: Number,
			required: true,
			min: 1,
		},

		capacity: {
			type: Number,
			required: true,
			min: 1,
		},

		size: { type: String },

		pricePerNight: {
			type: Number,
			required: true,
			min: 0,
		},

		amenities: {
			type: [String],
			default: [],
		},

		images: {
			hero: String,
			listing: String,
			gallery: {
				type: [String],
				default: [],
			},
		},

		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

export const Room = model("Room", RoomSchema);
