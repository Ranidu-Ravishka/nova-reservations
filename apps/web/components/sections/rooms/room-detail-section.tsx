"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Users, Maximize, Check, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { hotels, roomTypes } from "@/lib/data"
import { BookingWidget } from "@/components/booking/booking-widget"

interface Room {
  id: string
  name: string
  description: string
  basePrice: number
  maxGuests: number
  size: string
  amenities: string[]
  image: string
}

export function RoomDetailSection({ room }: { room: Room }) {
  const searchParams = useSearchParams()
  const hotelId = searchParams.get("hotel") || "colombo"
  const hotel = hotels[hotelId as keyof typeof hotels] || hotels.colombo

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Generate room gallery images
  const roomImages = [
    room.image,
    `/room-${room.id}-bathroom-luxury.jpg`,
    `/room-${room.id}-view-scenic.jpg`,
    `/room-${room.id}-amenities-detail.jpg`,
  ]

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % roomImages.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length)

  // Related rooms
  const relatedRooms = roomTypes.filter((r) => r.id !== room.id).slice(0, 3)

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-cream pt-24 pb-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-charcoal/60">
            <Link href="/rooms" className="hover:text-gold transition-colors">
              Rooms
            </Link>
            <span>/</span>
            <span className="text-charcoal">{room.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 bg-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-[16/10] rounded-2xl overflow-hidden"
                >
                  <img
                    src={roomImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${room.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Navigation */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-ivory/90 hover:bg-ivory text-charcoal rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-ivory/90 hover:bg-ivory text-charcoal rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Thumbnails */}
                <div className="flex gap-2 mt-4">
                  {roomImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-14 rounded-lg overflow-hidden transition-all ${
                        idx === currentImageIndex ? "ring-2 ring-gold" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Info */}
              <div>
                <div className="flex items-center gap-2 text-gold text-sm mb-2">
                  <Star className="w-4 h-4 fill-gold" />
                  <span>Premium Accommodation at {hotel.name}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-semibold text-charcoal mb-4">{room.name}</h1>

                <div className="flex items-center gap-6 text-charcoal/60 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Up to {room.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5" />
                    <span>{room.size}</span>
                  </div>
                </div>

                <p className="text-lg text-charcoal/70 leading-relaxed mb-8">
                  {room.description} Experience the epitome of comfort with carefully curated furnishings, premium
                  linens, and thoughtful amenities designed for the discerning traveler. Each room offers a tranquil
                  sanctuary where every detail has been considered to ensure your stay is nothing short of
                  extraordinary.
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Room Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-charcoal/70">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Preview */}
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Guest Reviews</h2>
                <div className="space-y-6">
                  {[
                    {
                      name: "Emma Thompson",
                      rating: 5,
                      text: "Absolutely stunning room with incredible views. The bed was heavenly and the bathroom was spa-like. Will definitely return!",
                    },
                    {
                      name: "Robert Chen",
                      rating: 5,
                      text: "Perfect for our anniversary. The attention to detail was impressive and the staff went above and beyond.",
                    },
                  ].map((review, idx) => (
                    <div key={idx} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                        ))}
                      </div>
                      <p className="text-charcoal/70 mb-2">"{review.text}"</p>
                      <p className="text-sm text-charcoal/50">— {review.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingWidget room={room} hotel={hotel} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Rooms */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-semibold text-charcoal mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedRooms.map((relatedRoom) => (
              <Link key={relatedRoom.id} href={`/rooms/${relatedRoom.id}?hotel=${hotelId}`} className="group">
                <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={relatedRoom.image || "/placeholder.svg"}
                      alt={relatedRoom.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">{relatedRoom.name}</h3>
                    <p className="text-charcoal/60 text-sm mb-4">From ${relatedRoom.basePrice}/night</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
