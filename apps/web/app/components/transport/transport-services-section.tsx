"use client"

import { motion } from "framer-motion"
import { Plane, Building2, Mountain, RefreshCw } from "lucide-react"

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Seamless pickup and drop-off from Bandaranaike International Airport with flight tracking and meet & greet service.",
    features: ["Flight tracking", "Meet & greet", "Luggage assistance", "Fixed pricing"],
  },
  {
    icon: Building2,
    title: "Inter-Hotel Transfers",
    description:
      "Travel between any Nova property in comfort. Perfect for guests exploring multiple destinations across Sri Lanka.",
    features: ["Direct routes", "Scenic detours", "Flexible scheduling", "Guest recognition"],
  },
  {
    icon: Mountain,
    title: "Day Tours & Excursions",
    description:
      "Explore Sri Lanka's wonders with our curated day trips to cultural sites, wildlife parks, and scenic destinations.",
    features: ["Expert drivers", "Customizable routes", "Local insights", "Full-day availability"],
  },
  {
    icon: RefreshCw,
    title: "Hourly Charter",
    description:
      "Flexible hourly rates for city exploration, shopping trips, or business meetings. Vehicle and driver at your disposal.",
    features: ["By-the-hour pricing", "Multiple stops", "Wait time included", "Corporate rates"],
  },
]

export function TransportServicesSection() {
  return (
    <section className="py-24 bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Our Services</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-ivory text-balance">
            Travel Solutions
          </h2>
          <p className="mt-4 text-lg text-ivory/60 max-w-2xl mx-auto">
            Comprehensive transport services tailored to your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-ivory mb-3">{service.title}</h3>
              <p className="text-ivory/60 mb-6">{service.description}</p>
              <ul className="grid grid-cols-2 gap-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-ivory/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
