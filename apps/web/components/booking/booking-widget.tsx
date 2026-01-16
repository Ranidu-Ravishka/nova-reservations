"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays, addDays } from "date-fns"
import Link from "next/link"

interface Room {
  id: string
  name: string
  basePrice: number
  maxGuests: number
}

interface Hotel {
  id: string
  name: string
}

export function BookingWidget({ room, hotel }: { room: Room; hotel: Hotel }) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 1))
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 3))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 2
  const subtotal = room.basePrice * nights
  const taxes = subtotal * 0.15
  const total = subtotal + taxes

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-lg border border-border"
    >
      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-serif font-semibold text-charcoal">${room.basePrice}</span>
          <span className="text-charcoal/60">/ night</span>
        </div>
        <p className="text-sm text-charcoal/50 mt-1">at {hotel.name}</p>
      </div>

      {/* Date Selection */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal rounded-xl h-14 bg-transparent"
              >
                <Calendar className="mr-2 h-4 w-4 text-gold" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-charcoal/50">Check-in</span>
                  <span className="text-sm">{checkIn ? format(checkIn, "MMM d") : "Select"}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal rounded-xl h-14 bg-transparent"
              >
                <Calendar className="mr-2 h-4 w-4 text-gold" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-charcoal/50">Check-out</span>
                  <span className="text-sm">{checkOut ? format(checkOut, "MMM d") : "Select"}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date <= (checkIn || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-sm text-charcoal/50">Guests</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal">Adults</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center">{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={() => setAdults(Math.min(room.maxGuests, adults + 1))}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal">Children</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center">{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-transparent"
                  onClick={() => setChildren(Math.min(room.maxGuests - adults, children + 1))}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-border pt-4 mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/60">
            ${room.basePrice} x {nights} nights
          </span>
          <span className="text-charcoal">${subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-charcoal/60">Taxes & fees (15%)</span>
          <span className="text-charcoal">${taxes.toFixed(0)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-2 border-t border-border">
          <span className="text-charcoal">Total</span>
          <span className="text-charcoal">${total.toFixed(0)}</span>
        </div>
      </div>

      {/* Book Button */}
      <Link
        href={`/booking?hotel=${hotel.id}&room=${room.id}&checkin=${checkIn?.toISOString()}&checkout=${checkOut?.toISOString()}&adults=${adults}&children=${children}`}
      >
        <Button className="w-full bg-gold text-charcoal hover:bg-gold-light font-medium py-6 text-base rounded-full">
          Reserve Now
        </Button>
      </Link>

      <p className="text-xs text-charcoal/50 text-center mt-4">Free cancellation up to 48 hours before check-in</p>
    </motion.div>
  )
}
