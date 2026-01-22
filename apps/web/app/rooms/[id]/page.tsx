import { notFound } from "next/navigation";
import { RoomDetailSection } from "@/components/sections/rooms/room-detail-section";
import { fetchRoomById } from "@/lib/api";

export default async function RoomPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const room = await fetchRoomById(id);
	if (!room) notFound();

	return <RoomDetailSection room={room} />;
}
