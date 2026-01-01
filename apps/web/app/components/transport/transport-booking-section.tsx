"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, Car, Users, Calculator, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { vehicles } from "@/lib/data"

const popularRoutes = [
  { from: "Colombo Airport (CMB)", to: "Nova Colombo", distance: 35, price: 75 },
  { from: "Nova Colombo", to: "Nova Kandy", distance: 120, price: 180 },
  { from: "Nova Kandy", to: "Nova Nuwara Eliya", distance: 80, price: 120 },
  { from: "Nova Galle", to: "Nova Colombo", distance: 130, price: 195 },
]

export function TransportBookingSection() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [time, setTime] = useState("10:00")
  const [selectedVehicle, setSelectedVehicle] = useState("sedan")
  const [passengers, setPassengers] = useState("2")
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const vehicle = vehicles.find((v) => v.id === selectedVehicle)!
  const estimatedPrice = estimatedDistance ? estimatedDistance * vehicle.pricePerKm : null

  const handleRouteSelect = (route: (typeof popularRoutes)[0]) => {
    setPickupLocation(route.from)
    setDropoffLocation(route.to)
    setEstimatedDistance(route.distance)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      // Reset form
      setPickupLocation("")
      setDropoffLocation("")
      setEstimatedDistance(null)
    }, 3000)
  }

  return (
    <section id="booking" className="py-24 bg-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-medium">Book Now</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif font-semibold text-charcoal text-balance">
            Reserve Your Transport
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl p-12 shadow-sm text-center"
              >
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-charcoal mb-4">Booking Confirmed!</h3>
                <p className="text-charcoal/60">
                  Your transport has been reserved. A confirmation email will be sent shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickup Location */}
                  <div className="md:col-span-2">
                    <Label className="text-charcoal/70 mb-2 block">Pickup Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                      <Input
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="pl-12 rounded-xl h-14"
                        placeholder="Enter pickup address or select from popular routes"
                        required
                      />
                    </div>
                  </div>

                  {/* Dropoff Location */}
                  <div className="md:col-span-2">
                    <Label className="text-charcoal/70 mb-2 block">Drop-off Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                      <Input
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="pl-12 rounded-xl h-14"
                        placeholder="Enter destination address"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <Label className="text-charcoal/70 mb-2 block">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal rounded-xl h-14 bg-transparent"
                        >
                          <Calendar className="mr-2 h-5 w-5 text-gold" />
                          {date ? format(date, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(d) => d < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time */}
                  <div>
                    <Label className="text-charcoal/70 mb-2 block">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="pl-12 rounded-xl h-14"
                        required
                      />
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div>
                    <Label className="text-charcoal/70 mb-2 block">Vehicle Type</Label>
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                      <SelectTrigger className="w-full rounded-xl h-14">
                        <Car className="mr-2 h-5 w-5 text-gold" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} ({v.capacity} pax)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Passengers */}
                  <div>
                    <Label className="text-charcoal/70 mb-2 block">Passengers</Label>
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="w-full rounded-xl h-14">
                        <Users className="mr-2 h-5 w-5 text-gold" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} Passenger{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price Estimate */}
                {estimatedPrice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-6 bg-gold/10 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator className="w-5 h-5 text-gold" />
                      <span className="font-medium text-charcoal">Price Estimate</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-sm text-charcoal/60">
                          {estimatedDistance} km × ${vehicle.pricePerKm}/km
                        </span>
                      </div>
                      <div>
                        <span className="text-3xl font-serif font-semibold text-charcoal">
                          ${estimatedPrice.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-8 bg-gold text-charcoal hover:bg-gold-light font-medium py-6 text-base rounded-full"
                >
                  Book Transport
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </motion.div>

          {/* Popular Routes Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-charcoal mb-6">Popular Routes</h3>
              <div className="space-y-4">
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => handleRouteSelect(route)}
                    className="w-full text-left p-4 rounded-xl border border-border hover:border-gold hover:bg-gold/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-1">
                      <MapPin className="w-3 h-3" />
                      {route.from}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-charcoal font-medium mb-2">
                      <ArrowRight className="w-3 h-3 text-gold" />
                      {route.to}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal/50">{route.distance} km</span>
                      <span className="text-gold font-medium">From ${route.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-charcoal rounded-2xl p-6 mt-6 text-ivory">
              <h3 className="text-lg font-semibold mb-4">Need Assistance?</h3>
              <p className="text-ivory/60 text-sm mb-4">
                Our transport team is available 24/7 to help with your booking.
              </p>
              <a href="tel:+94112345678" className="text-gold font-medium hover:underline">
                +94 11 234 5678
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
