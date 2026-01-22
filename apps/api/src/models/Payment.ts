import { model, Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    paypalPaymentId: { type: String, required: true },
    payerId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["CREATED", "COMPLETED", "FAILED"],
      default: "CREATED",
    },
  },
  { timestamps: true },
);

export const Payment = model("Payment", PaymentSchema);
