import {
  HotelHeroSection,
  HotelOverviewSection,
  HotelAmenitiesSection,
  HotelGallerySection,
  HotelRoomsSection,
} from "@/components/sections/hotels"

import { hotels } from "@/lib/data"
import { notFound } from "next/navigation"

type HotelKey = keyof typeof hotels

export default async function HotelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const hotel = hotels[id as HotelKey]

  if (!hotel) {
    notFound()
  }

  return (
    <>
      <HotelHeroSection hotel={hotel} />

      <HotelOverviewSection
        hotel={{
          id: hotel.id,
          name: hotel.name,
          longDescription: hotel.longDescription,
          coordinates: hotel.coordinates,
        }}
      />

      <HotelAmenitiesSection amenities={hotel.amenities} />

      <HotelGallerySection
        images={hotel.galleryImages}
        hotelName={hotel.name}
      />

      <HotelRoomsSection
        hotelId={hotel.id}
        hotelName={hotel.name}
      />
    </>
  )
}
