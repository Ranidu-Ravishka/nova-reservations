"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { vehicles } from "@/lib/data"

export function TransportFleetSection() {
  return (
    <section id="fleet" className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Our Fleet</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
            Premium Vehicles
          </h2>
          <p className="mt-4 text-lg text-charcoal/60 max-w-2xl mx-auto">
            Choose from our collection of meticulously maintained luxury vehicles
          </p>
        </motion.div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-sm text-ivory px-3 py-1 rounded-full text-sm">
                    {vehicle.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">{vehicle.name}</h3>
                  <p className="text-charcoal/60 text-sm mb-4">{vehicle.description}</p>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-sm text-charcoal/50 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{vehicle.capacity} passengers</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {vehicle.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-charcoal/5 rounded-full text-xs text-charcoal/70">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-serif font-semibold text-charcoal">${vehicle.pricePerKm}</span>
                      <span className="text-sm text-charcoal/50"> / km</span>
                    </div>
                    <Link href={`#booking?vehicle=${vehicle.id}`}>
                      <Button
                        variant="outline"
                        className="rounded-full border-gold text-gold hover:bg-gold hover:text-charcoal bg-transparent"
                      >
                        Select
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
