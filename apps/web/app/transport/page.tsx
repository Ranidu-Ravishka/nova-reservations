import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"

import { TransportHeroSection } from "@/components/transport/transport-hero"
import { TransportServicesSection } from "@/components/transport/transport-services"
import { TransportFleetSection } from "@/components/transport/transport-fleet"
import { TransportBookingSection } from "@/components/transport/transport-booking-section"

export const metadata = {
  title: "Transport Services | Nova Reservations",
  description:
    "Premium transport services across Sri Lanka - airport pickups, luxury car rentals, chauffeur services, and intercity travel.",
}

export default function TransportPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <TransportHeroSection />
      <TransportServicesSection />
      <TransportFleetSection />
      <TransportBookingSection />
      <Footer />
    </main>
  )
}
