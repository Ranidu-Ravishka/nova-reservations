"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "London, UK",
    rating: 5,
    text: "An absolutely stunning experience. The attention to detail at Nova Colombo was impeccable. From the moment we arrived, we felt like royalty. Will definitely be returning.",
    hotel: "Nova Colombo",
    image: "/elegant-professional-woman.png",
  },
  {
    id: 2,
    name: "James Anderson",
    location: "Sydney, Australia",
    rating: 5,
    text: "Nova Kandy exceeded all expectations. The views of the mountains, the service, the food - everything was world-class. A truly unforgettable retreat.",
    hotel: "Nova Kandy",
    image: "/professional-man-portrait-business.png",
  },
  {
    id: 3,
    name: "Maria Garcia",
    location: "Barcelona, Spain",
    rating: 5,
    text: "The beachfront property in Galle is breathtaking. We spent a week and didn't want to leave. The colonial charm combined with modern luxury is perfect.",
    hotel: "Nova Galle",
    image: "/elegant-woman-portrait-mediterranean.jpg",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Guest Stories</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
            What Our Guests Say
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-sm"
            >
              <Quote className="w-12 h-12 text-gold/30 mb-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex]?.rating || 0)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>

              {/* Text */}
              <p className="text-xl md:text-2xl text-charcoal/80 font-light leading-relaxed mb-8">
                "{testimonials[currentIndex]?.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentIndex]?.image || "/placeholder.svg"}
                  alt={testimonials[currentIndex]?.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-charcoal">{testimonials[currentIndex]?.name}</h4>
                  <p className="text-sm text-charcoal/60">
                    {testimonials[currentIndex]?.location} · {testimonials[currentIndex]?.hotel}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-charcoal/20 hover:border-gold hover:text-gold bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-gold w-6" : "bg-charcoal/20"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-charcoal/20 hover:border-gold hover:text-gold bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
