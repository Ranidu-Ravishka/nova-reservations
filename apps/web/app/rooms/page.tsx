import { Suspense } from "react";
import { RoomsListingSection } from "@/components/sections/rooms/rooms-listing-section";

export default function RoomsPage() {
	return (
		<main className="min-h-screen bg-cream">
			<Suspense
				fallback={
					<div className="p-8 text-center text-charcoal/70">
						Loading rooms...
					</div>
				}
			>
				<RoomsListingSection />
			</Suspense>
		</main>
	);
}
