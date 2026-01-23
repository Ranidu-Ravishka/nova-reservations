import bcrypt from "bcryptjs";
import {
	type HydratedDocument,
	type InferSchemaType,
	type Model,
	model,
	Schema,
} from "mongoose";

type UserRole = "ADMIN" | "STAFF" | "CUSTOMER" | "USER";

type UserBase = {
	name: string;
	email: string;
	password: string;
	role: UserRole;
};

type UserMethods = {
	comparePassword(candidate: string): Promise<boolean>;
};

type UserModelType = Model<UserBase, Record<string, never>, UserMethods>;

/* ---------- USER SCHEMA ---------- */
const userSchema = new Schema<UserBase, UserModelType, UserMethods>(
	{
		name: {
			type: String,
			required: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},

		password: {
			type: String,
			required: true,
			select: true,
		},

		role: {
			type: String,
			enum: ["ADMIN", "STAFF", "CUSTOMER", "USER"],
			default: "CUSTOMER",
		},
	},
	{ timestamps: true },
);

/* ---------- TYPES ---------- */
export type UserSchemaType = InferSchemaType<typeof userSchema>;

/* ---------- PASSWORD HASHING ---------- */
userSchema.pre(
	"save",
	async function (this: HydratedDocument<UserSchemaType, UserMethods>) {
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	},
);

/* ---------- PASSWORD COMPARISON ---------- */
userSchema.methods.comparePassword = async function (
	this: HydratedDocument<UserSchemaType, UserMethods>,
	candidate: string,
): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

/* ---------- MODEL ---------- */
export const UserModel = model<UserBase, UserModelType>(
	"User",
	userSchema,
);

/* Optional default export (only if you really need it) */
export default UserModel;
