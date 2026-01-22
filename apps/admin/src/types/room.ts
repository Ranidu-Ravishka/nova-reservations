export type RoomType = "DELUXE" | "PREMIUM" | "PRESIDENTIAL" | "SUITE";

export type RoomImages = {
	hero?: string;
	listing?: string;
	gallery?: string[];
};

export type Room = {
	_id: string;

	name: string;
	type: RoomType;

	description?: string;

	hotelId:
		| string
		| {
				_id: string;
				name: string;
		  };

	totalRooms: number;
	capacity: number;
	size?: string;

	pricePerNight: number;

	amenities: string[];

	images?: RoomImages;

	isActive: boolean;

	// Optional availability flag for admin filtering
	isAvailable?: boolean;

	createdAt?: string;
	updatedAt?: string;
};
