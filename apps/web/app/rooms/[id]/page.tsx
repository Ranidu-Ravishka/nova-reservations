import { notFound } from "next/navigation";
import { RoomDetailSection } from "@/components/sections/rooms/room-detail-section";
import { fetchRoom } from "@/lib/api";

export default async function RoomPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const room = await fetchRoom(id);

	if (!room) {
		notFound();
	}

	return <RoomDetailSection room={room} />;
}
