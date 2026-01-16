"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Check } from "lucide-react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setEmail("")
        setIsSubmitted(false)
      }, 3000)
    }
  }

  return (
    <section className="py-24 bg-charcoal text-ivory relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('/luxury-hotel-exterior-night-lights-elegant.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-charcoal via-charcoal/95 to-charcoal" />

      <div className="mx-auto max-w-3xl px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Stay Updated</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-ivory text-balance">
            Subscribe to Our Newsletter
          </h2>
          <p className="mt-6 text-lg text-ivory/60">
            Receive exclusive offers, travel inspiration, and updates from Nova Reservations Group.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-ivory/10 border-ivory/20 text-ivory placeholder:text-ivory/40 rounded-full px-6 h-14 focus:border-gold focus:ring-gold"
              required
            />
            <Button
              type="submit"
              className="bg-gold text-charcoal hover:bg-gold-light font-medium px-8 h-14 rounded-full"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-sm text-ivory/40">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
