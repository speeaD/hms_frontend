import { getRooms } from "@/lib/data";
import RoomsClient from '@/components/RoomsClient';

export default async function Rooms() {
  const rooms = await getRooms()
  const tabs = ['All Rooms', 'Room Types', 'Housekeeping'];

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <RoomsClient rooms={rooms} tabs={tabs} />
    </div>
  );
}
