import { model, Schema } from "mongoose";

const StaffSchema = new Schema(
	{
		name: String,
		role: String,
		hotelId: { type: Schema.Types.ObjectId, ref: "Hotel" },
		phone: String,
		email: String,
	},
	{ timestamps: true },
);

export const Staff = model("Staff", StaffSchema);
