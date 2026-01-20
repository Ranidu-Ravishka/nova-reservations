import { notFound } from "next/navigation";
import {
	HotelAmenitiesSection,
	HotelGallerySection,
	HotelHeroSection,
	HotelOverviewSection,
} from "@/components/sections/hotels";
import { fetchHotelById } from "@/lib/api";

export default async function HotelPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// ✅ unwrap params
	const { id } = await params;

	const hotel = await fetchHotelById(id);

	if (!hotel) {
		notFound();
	}

	return (
		<>
			<HotelHeroSection hotel={hotel} />

			<HotelOverviewSection
				hotel={{
					id: hotel._id,
					name: hotel.name,
					description: hotel.description,
					coordinates: hotel.coordinates,
				}}
			/>

			<HotelAmenitiesSection amenities={hotel.amenities} />

			<HotelGallerySection images={hotel.images} hotelName={hotel.name} />
		</>
	);
}
