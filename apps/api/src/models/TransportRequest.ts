import { model, Schema } from "mongoose";

const TransportRequestSchema = new Schema(
	{
		transportId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Transport",
		},
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
		pickupLocation: { type: String },
		dropoffLocation: { type: String },
		pickupDate: { type: Date },
		passengers: { type: Number },
		notes: { type: String },
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "CANCELLED"],
			default: "PENDING",
		},
	},
	{ timestamps: true },
);

export const TransportRequest = model(
	"TransportRequest",
	TransportRequestSchema,
);
