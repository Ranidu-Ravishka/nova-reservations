import { notFound } from "next/navigation";
import {
	HotelAmenitiesSection,
	HotelGallerySection,
	HotelHeroSection,
	HotelOverviewSection,
} from "@/components/sections/hotels";
import { fetchHotelById, fetchRoomsByHotel } from "@/lib/api";
import { HotelRoomsSection } from "@/components/sections/hotels/hotel-rooms-section";

export default async function HotelPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const hotel = await fetchHotelById(id);
	if (!hotel) notFound();

	const rooms = await fetchRoomsByHotel(id);

	const images = [
		...(hotel.images?.shared || []),
		...(hotel.images?.unique || []),
	];

	return (
		<>
			<HotelHeroSection
				hotel={{
					id: hotel._id,
					name: hotel.name,
					description: hotel.description,
					location: hotel.location,
					images: hotel.images,
				}}
			/>

			<HotelOverviewSection
				hotel={{
					id: hotel._id,
					name: hotel.name,
					description: hotel.description,
					coordinates: hotel.coordinates,
				}}
			/>

			<HotelAmenitiesSection amenities={hotel.amenities} />

			<HotelRoomsSection
				hotelId={hotel._id}
				hotelName={hotel.name}
				rooms={rooms}
			/>

			<HotelGallerySection images={images} hotelName={hotel.name} />
		</>
	);
}
