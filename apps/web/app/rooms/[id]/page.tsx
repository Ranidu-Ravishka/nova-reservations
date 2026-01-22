import { notFound } from "next/navigation";
import { fetchRoomById } from "@/lib/api";
import { RoomDetailSection } from "@/components/sections/rooms/room-detail-section";

export default async function RoomPage({
	params,
}: {
	params: { id: string };
}) {
	const room = await fetchRoomById(params.id);

	if (!room) {
		notFound();
	}

	return <RoomDetailSection room={room} />;
}
