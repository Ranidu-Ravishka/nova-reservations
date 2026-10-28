import { model, Schema } from "mongoose";

const StaffSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		role: { type: String, required: true, trim: true },
		hotelId: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
		},
		phone: String,
		email: {
			type: String,
			trim: true,
			lowercase: true,
			match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		},
	},
	{ timestamps: true },
);

export const Staff = model("Staff", StaffSchema);
