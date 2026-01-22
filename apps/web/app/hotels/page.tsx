export const dynamic = "force-dynamic";

import { fetchHotels } from "@/lib/api";

interface Hotel {
	_id: string;
	name: string;
	location: string;
	description?: string;
}

export default async function HotelsPage() {
	let hotels: Hotel[] = [];
	try {
		hotels = await fetchHotels();
	} catch {
		hotels = [];
	}

	return (
		<div className="space-y-8">
			<h1 className="text-3xl font-bold">Our Hotels</h1>

			{hotels.length === 0 ? (
				<div className="rounded-xl border p-6 text-sm text-gray-600">
					Hotels are temporarily unavailable. Please try again later.
				</div>
			) : null}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{hotels.map((hotel: Hotel) => (
					<div key={hotel._id} className="border rounded-xl p-4 hover:shadow">
						<h2 className="text-xl font-semibold">{hotel.name}</h2>
						<p className="text-sm text-gray-600">{hotel.location}</p>
						<p className="mt-2 text-gray-700">{hotel.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
