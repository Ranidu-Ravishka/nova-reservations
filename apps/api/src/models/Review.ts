import { model, Schema } from "mongoose";

const ReviewSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
		rating: { type: Number, min: 1, max: 5, required: true },
		comment: { type: String, maxlength: 2000 },
	},
	{ timestamps: true },
);

export const Review = model("Review", ReviewSchema);
