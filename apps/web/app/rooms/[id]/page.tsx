import { notFound } from "next/navigation"
import { roomTypes } from "@/lib/data"
import { RoomDetailSection } from "@/components/sections/rooms/room-detail-section"

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const room = roomTypes.find((r) => r.id === id)

  if (!room) {
    notFound()
  }

  return <RoomDetailSection room={room} />
}
