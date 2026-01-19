import { notFound } from "next/navigation";
import {
	HotelAmenitiesSection,
	HotelGallerySection,
	HotelHeroSection,
	HotelOverviewSection,
	HotelRoomsSection,
} from "@/components/sections/hotels";

/* -------------------------
   API FETCH
-------------------------- */
async function getHotel(id: string) {
	const res = await fetch(`http://localhost:4000/api/hotels/${id}`, {
		cache: "no-store",
	});

	if (!res.ok) return null;
	return res.json();
}

/* -------------------------
   PAGE
-------------------------- */
export default async function HotelPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const hotel = await getHotel(id);

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
					longDescription: hotel.description,
					coordinates: hotel.coordinates ?? null,
				}}
			/>

			<HotelAmenitiesSection amenities={hotel.amenities ?? []} />

			<HotelGallerySection images={hotel.images ?? []} hotelName={hotel.name} />

			<HotelRoomsSection hotelId={hotel._id} hotelName={hotel.name} />
		</>
	);
}
