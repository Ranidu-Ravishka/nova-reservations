export function BookingFlow() {
	return (
		<section className="mx-auto w-full max-w-5xl px-6 py-16">
			<div className="mb-10 flex flex-col gap-3">
				<p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
					Booking journey
				</p>
				<h2 className="text-3xl font-light text-neutral-900">
					A refined flow from arrival to confirmation.
				</h2>
				<p className="max-w-2xl text-sm text-neutral-500">
					Every detail is designed to feel effortless, from selecting dates to
					receiving a tailored itinerary from our concierge team.
				</p>
			</div>
			<div className="grid gap-6 md:grid-cols-3">
				<div className="rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-sm">
					<p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
						01
					</p>
					<h3 className="mt-3 text-lg font-medium text-neutral-900">
						Choose your dates
					</h3>
					<p className="mt-2 text-sm text-neutral-500">
						Settle on your arrival and departure with a clear view of nightly
						rates and availability.
					</p>
				</div>
				<div className="rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-sm">
					<p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
						02
					</p>
					<h3 className="mt-3 text-lg font-medium text-neutral-900">
						Personalize the stay
					</h3>
					<p className="mt-2 text-sm text-neutral-500">
						Select preferred room details, guest count, and any special requests
						for your suite.
					</p>
				</div>
				<div className="rounded-3xl border border-neutral-200 bg-white px-6 py-8 shadow-sm">
					<p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
						03
					</p>
					<h3 className="mt-3 text-lg font-medium text-neutral-900">
						Confirm with confidence
					</h3>
					<p className="mt-2 text-sm text-neutral-500">
						Secure your reservation and receive a curated confirmation from our
						concierge team.
					</p>
				</div>
			</div>
		</section>
	);
}
