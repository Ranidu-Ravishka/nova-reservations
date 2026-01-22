import { notFound } from "next/navigation";
import {
	HotelAmenitiesSection,
	HotelGallerySection,
	HotelHeroSection,
	HotelOverviewSection,
} from "@/components/sections/hotels";
import {
	HotelRoomsSection,
	type RoomType,
} from "@/components/sections/hotels/hotel-rooms-section";
import { getHotelImageList } from "@/lib/hotelImages";
import { fetchHotelByIdServer, fetchRoomsByHotelServer } from "@/lib/serverApi";

export default async function HotelPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const hotel = await fetchHotelByIdServer(id);
	if (!hotel) notFound();

	const rooms = (await fetchRoomsByHotelServer(id)) as RoomType[];
	const images = getHotelImageList(hotel.images);

	return (
		<>
			<HotelHeroSection
				hotel={{
					id: hotel._id,
					name: hotel.name,
					description: hotel.description,
					location: hotel.location ?? "Location unavailable",
					images,
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
