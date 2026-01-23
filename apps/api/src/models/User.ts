import mongoose, {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";
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
  async function (this: HydratedDocument<UserSchemaType>) {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  },
);

/* ---------- PASSWORD COMPARISON ---------- */
userSchema.methods.comparePassword = async function (
  this: HydratedDocument<UserSchemaType>,
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

/* ---------- MODEL ---------- */
export const UserModel = model<UserSchemaType>("User", userSchema);

/* Optional default export (only if you really need it) */
export default UserModel;
