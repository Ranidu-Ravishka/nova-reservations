import { model, Schema } from "mongoose";

const RoomSchema = new Schema(
	{
		hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
		name: String,
		pricePerNight: Number,
		size: String,
		occupancy: Number,
		amenities: [String],
		images: [String],
	},
	{ timestamps: true },
);

export const Room = model("Room", RoomSchema);
