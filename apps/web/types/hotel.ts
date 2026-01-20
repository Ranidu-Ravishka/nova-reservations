export interface Hotel {
	_id: string;
	name: string;
	description?: string;
	amenities: string[];
	images: string[];
	coordinates: {
		lat: number;
		lng: number;
	};
	location?: string;
	phone?: string;
	email?: string;
}
