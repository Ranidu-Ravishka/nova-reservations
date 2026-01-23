import { notFound } from "next/navigation";
import RoomDetailSection from "@/components/sections/rooms/room-detail-section";
import { fetchRoomById } from "@/lib/api";
import type { Room } from "@/types/room";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ REQUIRED IN NEXT 15
  const { id } = await params;

  if (!id) notFound();

  const room: Room | null = await fetchRoomById(id);

  if (!room) notFound();

  return <RoomDetailSection room={room} />;
}
