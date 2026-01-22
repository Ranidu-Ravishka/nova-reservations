import type { Metadata } from "next";
import { fetchTransports } from "@/lib/api";
import TransportPageClient from "./TransportPageClient";

export const metadata: Metadata = {
	title: "Transport Services | Nova Reservations",
	description:
		"Premium private transport services: airport pickups, hotel transfers, and custom routes.",
};

export default async function TransportPage() {
	const transports = await fetchTransports();
	return <TransportPageClient initialTransports={transports} />;
}
