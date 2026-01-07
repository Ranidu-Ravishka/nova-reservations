import { RoomDetailSection } from "@/components/sections/rooms"
import { roomTypes } from "@/lib/data"

export default function RoomPage({ params }: { params: { id: string } }) {
  const room = roomTypes.find((r) => r.id === params.id)

  if (!room) return null

  return <RoomDetailSection room={room} />
}
