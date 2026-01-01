import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: "ADMIN" | "STAFF" | "CUSTOMER";
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["ADMIN", "STAFF", "CUSTOMER"],
			default: "CUSTOMER",
		},
	},
	{ timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
