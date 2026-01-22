import { notFound } from "next/navigation";
import { RoomDetailSection } from "@/components/sections/rooms/room-detail-section";
import { fetchRoomByIdServer } from "@/lib/serverApi";

export default async function RoomPage({ params }: { params: { id: string } }) {
	const room = await fetchRoomByIdServer(params.id);

	if (!room) {
		notFound();
	}

	return <RoomDetailSection room={room} />;
}
