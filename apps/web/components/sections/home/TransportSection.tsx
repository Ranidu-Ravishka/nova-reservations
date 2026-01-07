"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Car, Users, Plane, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Car,
    title: "Private Cars",
    description: "Luxury sedans for intimate transfers",
  },
  {
    icon: Users,
    title: "Executive Vans",
    description: "Spacious vehicles for group travel",
  },
  {
    icon: Plane,
    title: "Airport Pickup",
    description: "Seamless arrivals and departures",
  },
]

export default function TransportSection() {
  return (
    <section className="py-24 bg-charcoal text-ivory relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Travel in Style</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-ivory text-balance">
              Private Transport Service
            </h2>
            <p className="mt-6 text-lg text-ivory/60 leading-relaxed">
              Experience seamless travel across Sri Lanka with our fleet of luxury vehicles. From airport pickups to
              inter-hotel transfers, travel in comfort and style.
            </p>

            <div className="mt-10 space-y-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <service.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ivory">{service.title}</h3>
                    <p className="text-ivory/60 text-sm">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/transport" className="inline-block mt-10">
              <Button className="bg-gold text-charcoal hover:bg-gold-light font-medium px-8 py-6 text-base rounded-full">
                Explore Transport Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
              <img src="/luxury-chauffeur-car-service-mercedes-black-sri-la.jpg" alt="Luxury Transport" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 glass-dark rounded-xl p-6 max-w-[280px]">
              <div className="text-3xl font-serif font-semibold text-gold mb-2">24/7</div>
              <p className="text-ivory/80 text-sm">Round-the-clock service for your convenience</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
