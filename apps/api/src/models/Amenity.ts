import { model, Schema } from "mongoose";

const AmenitySchema = new Schema({
	name: String,
	icon: String,
});

export const Amenity = model("Amenity", AmenitySchema);
