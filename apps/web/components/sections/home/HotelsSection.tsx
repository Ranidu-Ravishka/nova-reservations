"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  images?: {
    hero?: string;
    listing?: string;
    gallery?: string[];
  };
}

export default function HotelsSection() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hotels`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch hotels");
        return res.json();
      })
      .then(setHotels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-24 text-center">Loading hotels...</div>;
  }

  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {hotels.map((hotel, i) => {
          const hero =
            hotel.images?.listing ||
            hotel.images?.hero ||
            "/placeholder.svg";

          return (
            <motion.article
              key={hotel._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Link href={`/hotels/${hotel._id}`} className="group block">
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={hero}
                    alt={hotel.name}
                    className="h-72 w-full object-cover group-hover:scale-110 transition"
                  />

                  <div className="absolute inset-0 bg-black/50" />

                  <div className="absolute bottom-0 p-6 text-white space-y-2">
                    <div className="flex items-center gap-2 text-gold text-sm">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </div>

                    <h3 className="text-2xl font-serif">{hotel.name}</h3>

                    {hotel.description && (
                      <p className="text-sm text-white/80 line-clamp-2">
                        {hotel.description}
                      </p>
                    )}

                    <span className="text-gold flex items-center gap-2 mt-2">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
