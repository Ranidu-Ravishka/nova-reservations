import { notFound } from "next/navigation";
import { RoomDetailSection } from "@/components/sections/rooms/room-detail-section";
import { fetchRoomById } from "@/lib/api";

export default async function RoomPage({ params }: { params: { id: string } }) {
	const room = await fetchRoomById(params.id);

	if (!room) {
		notFound();
	}

	return <RoomDetailSection room={room} />;
}
