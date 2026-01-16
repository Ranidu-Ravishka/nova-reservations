"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Maximize, ArrowRight, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { roomTypes, hotels } from "@/lib/data"

export function RoomsListingSection() {
  const searchParams = useSearchParams()
  const hotelParam = searchParams.get("hotel")

  const [selectedHotel, setSelectedHotel] = useState<string>(hotelParam || "all")
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [capacity, setCapacity] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredRooms = roomTypes.filter((room) => {
    const matchesPrice = (room.basePrice ?? 0) >= priceRange[0]! && (room.basePrice ?? 0) <= priceRange[1]!
    const matchesCapacity = capacity === "all" || (room.maxGuests ?? 0) >= Number.parseInt(capacity)
    return matchesPrice && matchesCapacity
  })

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/luxury-hotel-room-collection-hero.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-charcoal/70" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold text-sm tracking-[0.3em] uppercase font-medium"
          >
            Accommodations
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-ivory text-balance"
          >
            Rooms & Suites
          </motion.h1>
        </div>
      </section>

      {/* Filters & Rooms */}
      <section className="py-16 bg-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <p className="text-charcoal/60">
              Showing {filteredRooms.length} room type{filteredRooms.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-4">
              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-4">
                <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                  <SelectTrigger className="w-[180px] rounded-full bg-card border-border">
                    <SelectValue placeholder="Select Hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hotels</SelectItem>
                    {Object.values(hotels).map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger className="w-[150px] rounded-full bg-card border-border">
                    <SelectValue placeholder="Guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Capacity</SelectItem>
                    <SelectItem value="2">2+ Guests</SelectItem>
                    <SelectItem value="3">3+ Guests</SelectItem>
                    <SelectItem value="4">4+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden rounded-full bg-transparent"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-charcoal">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-charcoal/60 mb-2 block">Hotel</label>
                  <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                    <SelectTrigger className="w-full rounded-full">
                      <SelectValue placeholder="Select Hotel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hotels</SelectItem>
                      {Object.values(hotels).map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-charcoal/60 mb-2 block">Guests</label>
                  <Select value={capacity} onValueChange={setCapacity}>
                    <SelectTrigger className="w-full rounded-full">
                      <SelectValue placeholder="Guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Capacity</SelectItem>
                      <SelectItem value="2">2+ Guests</SelectItem>
                      <SelectItem value="3">3+ Guests</SelectItem>
                      <SelectItem value="4">4+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-charcoal/60 mb-4 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={1500}
                    step={50}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/rooms/${room.id}${selectedHotel !== "all" ? `?hotel=${selectedHotel}` : ""}`}>
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={room.image || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-charcoal/80 backdrop-blur-sm text-ivory px-4 py-2 rounded-full text-sm font-medium">
                        From ${room.basePrice}/night
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-serif font-semibold text-charcoal mb-3">{room.name}</h3>
                      <p className="text-charcoal/60 mb-6">{room.description}</p>

                      {/* Room Details */}
                      <div className="flex items-center gap-6 text-sm text-charcoal/50 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Up to {room.maxGuests} Guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Maximize className="w-4 h-4" />
                          <span>{room.size}</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {room.amenities.slice(0, 4).map((amenity) => (
                          <span key={amenity} className="px-3 py-1 bg-charcoal/5 rounded-full text-xs text-charcoal/70">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="px-3 py-1 bg-gold/10 rounded-full text-xs text-gold font-medium">
                            +{room.amenities.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gold font-medium group-hover:gap-4 transition-all">
                        <span>View Details</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
