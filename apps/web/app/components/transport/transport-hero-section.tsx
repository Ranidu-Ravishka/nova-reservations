"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Shield, MapPin } from "lucide-react"
import Link from "next/link"

const features = [
  { icon: Clock, label: "24/7 Availability" },
  { icon: Shield, label: "Licensed & Insured" },
  { icon: MapPin, label: "Island-Wide Coverage" },
]

export function TransportHeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/luxury-transport-hero-sri-lanka-scenic-road.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gold text-sm tracking-[0.3em] uppercase font-medium"
            >
              Travel in Style
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-ivory text-balance"
            >
              Private Transport Service
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-xl text-ivory/80 leading-relaxed"
            >
              Experience seamless travel across Sri Lanka with our premium fleet of luxury vehicles. From airport
              pickups to scenic tours, travel in comfort and style.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-6"
            >
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-ivory/80 text-sm">{feature.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="#booking">
                <Button className="bg-gold text-charcoal hover:bg-gold-light font-medium px-8 py-6 text-base rounded-full">
                  Book Transport
                </Button>
              </Link>
              <Link href="#fleet">
                <Button
                  variant="outline"
                  className="border-ivory/30 text-ivory hover:bg-ivory/10 font-medium px-8 py-6 text-base rounded-full bg-transparent"
                >
                  View Fleet
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
