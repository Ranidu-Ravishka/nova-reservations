// apps/web/lib/data.ts

export const hotels = {
  colombo: {
    id: "colombo",
    name: "Nova Colombo",
    tagline: "Urban Luxury",
    description: "A sophisticated urban sanctuary in the heart of Colombo.",
    longDescription:
      "Nova Colombo offers contemporary luxury with world-class amenities, fine dining, and city views.",
    heroImage: "/luxury-hotel-colombo.jpg",
    address: "123 Galle Face, Colombo 03",
    phone: "+94 11 234 5678",
    email: "colombo@novareservations.lk",
    coordinates: {
      lat: 6.9271,
      lng: 79.8612,
    },
    amenities: [
      "Rooftop Infinity Pool",
      "World-Class Spa",
      "Fine Dining Restaurant",
      "Fitness Center",
      "High-Speed WiFi",
    ],
    gallery: [
      "/colombo-1.jpg",
      "/colombo-2.jpg",
      "/colombo-3.jpg",
      "/colombo-4.jpg",
    ],
  },
}

export const roomTypes = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "Elegant room with modern amenities.",
    image: "/room-deluxe.jpg",
    maxGuests: 2,
    size: "35 m²",
    basePrice: 180,
  },
]
