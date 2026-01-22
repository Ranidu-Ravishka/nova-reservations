import bcrypt from "bcryptjs";




/* ---------- USER SCHEMA ---------- */
const userSchema = new Schema(
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
      select: true, // 
    },

		role: {
			type: String,
			enum: ["ADMIN", "STAFF", "CUSTOMER", "USER"],
			// Default to CUSTOMER because most customer-facing routes authorize CUSTOMER.
			// Keep legacy USER for backwards compatibility with existing data.
			default: "CUSTOMER",
		},
	},
	{ timestamps: true },
);

/* ---------- PASSWORD HASHING ---------- */
userSchema.pre("save", async function () {
	// `this` is now correctly inferred
	if (!this.isModified("password")) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

/* ---------- PASSWORD COMPARISON ---------- */
userSchema.methods.comparePassword = async function (
	candidate: string,
): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

/* ---------- TYPES ---------- */
export type User = InferSchemaType<typeof userSchema> & {
	comparePassword(candidate: string): Promise<boolean>;
};

/* ---------- MODEL ---------- */
export const UserModel = model<User>("User", userSchema);

export const User = model("User", userSchema);