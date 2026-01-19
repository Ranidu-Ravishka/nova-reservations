import { Suspense } from "react";
import { RoomsListingSection } from "@/components/sections/rooms/rooms-listing-section";

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading rooms...</div>}>
      <RoomsListingSection />
    </Suspense>
  );
}
