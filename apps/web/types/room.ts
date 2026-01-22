import type { ImageSet } from "./images";

export interface Room {
	_id: string;
	hotelId: string;
	name: string;
	description: string;
	pricePerNight: number;
	capacity: number;
	occupancy?: number;
	totalRooms: number;
	size?: string;
	amenities?: string[];
	images: ImageSet;
}
