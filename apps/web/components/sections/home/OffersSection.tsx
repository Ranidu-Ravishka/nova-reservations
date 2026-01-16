"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Percent } from "lucide-react"
import Link from "next/link"

const offers = [
  {
    id: 1,
    title: "Early Bird Special",
    discount: "25% Off",
    description: "Book 60 days in advance and enjoy exclusive savings on any of our properties.",
    validUntil: "Dec 31, 2025",
    image: "/luxury-hotel-pool-sunrise-sri-lanka.jpg",
  },
  {
    id: 2,
    title: "Honeymoon Package",
    discount: "Complimentary",
    description: "Romantic dinners, spa treatments, and suite upgrades for newlyweds.",
    validUntil: "Ongoing",
    image: "/romantic-luxury-hotel-suite-rose-petals-candles.jpg",
  },
  {
    id: 3,
    title: "Extended Stay",
    discount: "4th Night Free",
    description: "Stay 3 nights and get your 4th night complimentary at any Nova property.",
    validUntil: "Mar 31, 2026",
    image: "/luxury-hotel-terrace-ocean-view-sunset.jpg",
  },
]

export default function OffersSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Special Offers</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
              Exclusive Deals
            </h2>
          </div>
          <Link href="/offers">
            <Button
              variant="outline"
              className="border-charcoal/20 text-charcoal hover:border-gold hover:text-gold rounded-full bg-transparent"
            >
              View All Offers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative aspect-3/2 overflow-hidden">
                  <img
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-gold text-charcoal px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    {offer.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">{offer.title}</h3>
                  <p className="text-charcoal/60 text-sm mb-4 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-charcoal/50">
                      <Calendar className="w-4 h-4" />
                      <span>Valid until {offer.validUntil}</span>
                    </div>
                    <Link href={`/offers/${offer.id}`} className="text-gold text-sm font-medium hover:underline">
                      Learn More
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
