"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, User, CreditCard, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays, addDays } from "date-fns"
import { hotels, roomTypes } from "@/lib/data"

const steps = [
  { id: 1, name: "Select Dates", icon: Calendar },
  { id: 2, name: "Guest Info", icon: User },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Confirmation", icon: Check },
]

export function BookingFlow() {
  const searchParams = useSearchParams()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedHotel, setSelectedHotel] = useState(searchParams.get("hotel") || "colombo")
  const [selectedRoom, setSelectedRoom] = useState(searchParams.get("room") || "deluxe")
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.get("checkin") ? new Date(searchParams.get("checkin")!) : addDays(new Date(), 1),
  )
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.get("checkout") ? new Date(searchParams.get("checkout")!) : addDays(new Date(), 3),
  )
  const [adults, setAdults] = useState(Number.parseInt(searchParams.get("adults") || "2"))
  const [children, setChildren] = useState(Number.parseInt(searchParams.get("children") || "0"))

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  })

  const hotel = hotels[selectedHotel as keyof typeof hotels]
  const room = roomTypes.find((r) => r.id === selectedRoom)!
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 2
  const subtotal = room.basePrice * nights
  const taxes = subtotal * 0.15
  const total = subtotal + taxes

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = () => {
    // Simulate booking submission
    nextStep()
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id ? "bg-gold text-charcoal" : "bg-charcoal/10 text-charcoal/40"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-charcoal" : "text-charcoal/40"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-24 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-gold" : "bg-charcoal/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Select Dates */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Select Your Stay</h2>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Hotel</Label>
                      <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                        <SelectTrigger className="w-full rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(hotels).map((h) => (
                            <SelectItem key={h.id} value={h.id}>
                              {h.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Room Type</Label>
                      <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                        <SelectTrigger className="w-full rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name} - ${r.basePrice}/night
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">Check-in</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal rounded-xl h-12 bg-transparent"
                            >
                              <Calendar className="mr-2 h-4 w-4 text-gold" />
                              {checkIn ? format(checkIn, "MMM d, yyyy") : "Select date"}
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
                      </div>
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">Check-out</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal rounded-xl h-12 bg-transparent"
                            >
                              <Calendar className="mr-2 h-4 w-4 text-gold" />
                              {checkOut ? format(checkOut, "MMM d, yyyy") : "Select date"}
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">Adults</Label>
                        <Select value={adults.toString()} onValueChange={(v) => setAdults(Number.parseInt(v))}>
                          <SelectTrigger className="w-full rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n} Adult{n > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">Children</Label>
                        <Select value={children.toString()} onValueChange={(v) => setChildren(Number.parseInt(v))}>
                          <SelectTrigger className="w-full rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n} Child{n !== 1 ? "ren" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button onClick={nextStep} className="bg-gold text-charcoal hover:bg-gold-light rounded-full px-8">
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Guest Info */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Guest Information</h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">First Name</Label>
                        <Input
                          value={guestInfo.firstName}
                          onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                          className="rounded-xl h-12"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">Last Name</Label>
                        <Input
                          value={guestInfo.lastName}
                          onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                          className="rounded-xl h-12"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Email Address</Label>
                      <Input
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                        className="rounded-xl h-12"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Phone Number</Label>
                      <Input
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                        className="rounded-xl h-12"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Special Requests (Optional)</Label>
                      <textarea
                        value={guestInfo.specialRequests}
                        onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                        className="w-full min-h-[100px] rounded-xl border border-input bg-background px-4 py-3 text-sm"
                        placeholder="Any special requests for your stay..."
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="rounded-full px-8 bg-transparent">
                      Back
                    </Button>
                    <Button onClick={nextStep} className="bg-gold text-charcoal hover:bg-gold-light rounded-full px-8">
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-serif font-semibold text-charcoal mb-6">Payment Details</h2>

                  <div className="space-y-6">
                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Card Number</Label>
                      <Input
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        className="rounded-xl h-12"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">Expiry Date</Label>
                        <Input
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                          className="rounded-xl h-12"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label className="text-charcoal/70 mb-2 block">CVV</Label>
                        <Input
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          className="rounded-xl h-12"
                          placeholder="123"
                          type="password"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-charcoal/70 mb-2 block">Name on Card</Label>
                      <Input
                        value={paymentInfo.nameOnCard}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
                        className="rounded-xl h-12"
                        placeholder="JOHN DOE"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="rounded-full px-8 bg-transparent">
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-gold text-charcoal hover:bg-gold-light rounded-full px-8"
                    >
                      Complete Booking
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-2xl p-8 shadow-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <h2 className="text-3xl font-serif font-semibold text-charcoal mb-4">Booking Confirmed!</h2>
                  <p className="text-charcoal/60 mb-8">
                    Thank you for your reservation. A confirmation email has been sent to{" "}
                    {guestInfo.email || "your email"}.
                  </p>

                  <div className="bg-cream rounded-xl p-6 text-left mb-8">
                    <h3 className="font-semibold text-charcoal mb-4">Booking Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Confirmation #</span>
                        <span className="text-charcoal font-mono">
                          NRG-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Hotel</span>
                        <span className="text-charcoal">{hotel.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Room</span>
                        <span className="text-charcoal">{room.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Check-in</span>
                        <span className="text-charcoal">{checkIn ? format(checkIn, "MMM d, yyyy") : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal/60">Check-out</span>
                        <span className="text-charcoal">{checkOut ? format(checkOut, "MMM d, yyyy") : ""}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="text-charcoal font-semibold">Total Paid</span>
                        <span className="text-charcoal font-semibold">${total.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline" className="rounded-full px-8 bg-transparent">
                      Download Receipt
                    </Button>
                    <Button className="bg-gold text-charcoal hover:bg-gold-light rounded-full px-8">
                      View Booking
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Booking Summary Sidebar */}
          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold text-charcoal mb-4">Booking Summary</h3>

                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <h4 className="font-semibold text-charcoal">{room.name}</h4>
                  <p className="text-charcoal/60">{hotel.name}</p>
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">
                      {checkIn && checkOut
                        ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d")}`
                        : "Select dates"}
                    </span>
                    <span className="text-charcoal">
                      {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Guests</span>
                    <span className="text-charcoal">{adults + children}</span>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">
                      ${room.basePrice} x {nights} nights
                    </span>
                    <span className="text-charcoal">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Taxes & fees</span>
                    <span className="text-charcoal">${taxes.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span className="text-charcoal">Total</span>
                    <span className="text-charcoal">${total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
