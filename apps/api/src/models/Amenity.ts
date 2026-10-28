import { model, Schema } from "mongoose";

const AmenitySchema = new Schema({
	name: { type: String, required: true, trim: true },
	icon: { type: String, trim: true },
});

export const Amenity = model("Amenity", AmenitySchema);
