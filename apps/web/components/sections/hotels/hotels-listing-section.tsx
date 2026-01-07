"use client"

import { motion } from "framer-motion"
import { MapPin, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { hotels } from "@/lib/data"

const hotelsList = Object.values(hotels)

export function HotelsListingSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/hotels-hero-sri-lanka-collage.jpg')`,
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
            Our Collection
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-ivory text-balance"
          >
            Our Hotels
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-ivory/80 max-w-2xl mx-auto"
          >
            Four extraordinary destinations, each offering a unique window into Sri Lanka's diverse beauty
          </motion.p>
        </div>
      </section>

      {/* Hotels List */}
      <section className="py-24 bg-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-16">
            {hotelsList.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/hotels/${hotel.id}`} className="group block">
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden rounded-2xl ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="aspect-[4/3]">
                        <img
                          src={hotel.heroImage || "/placeholder.svg"}
                          alt={hotel.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-sm text-ivory px-4 py-2 rounded-full text-sm flex items-center gap-2">
                        <Star className="w-4 h-4 fill-gold text-gold" />
                        <span>5-Star Luxury</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="flex items-center gap-2 text-gold text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="tracking-wider uppercase">{hotel.tagline}</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-semibold text-charcoal mb-4">{hotel.name}</h2>
                      <p className="text-charcoal/70 text-lg mb-6 leading-relaxed">{hotel.longDescription}</p>

                      {/* Amenities Preview */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {hotel.amenities.slice(0, 4).map((amenity: string) => (
                          <span key={amenity} className="px-3 py-1 bg-charcoal/5 rounded-full text-sm text-charcoal/70">
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="px-3 py-1 bg-gold/10 rounded-full text-sm text-gold font-medium">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-gold font-medium group-hover:gap-4 transition-all">
                        <span>Explore {hotel.name}</span>
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
