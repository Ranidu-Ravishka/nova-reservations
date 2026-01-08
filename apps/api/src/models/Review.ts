import { model, Schema } from "mongoose";

const ReviewSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
		rating: { type: Number, min: 1, max: 5 },
		comment: String,
	},
	{ timestamps: true },
);

export const Review = model("Review", ReviewSchema);
