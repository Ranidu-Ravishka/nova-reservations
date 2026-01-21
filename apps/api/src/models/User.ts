import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const UserSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["ADMIN", "CUSTOMER", "STAFF"],
			default: "CUSTOMER",
		},
	},
	{ timestamps: true },
);

// Hash password before save
UserSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 10);
});

export const User = model("User", UserSchema);
