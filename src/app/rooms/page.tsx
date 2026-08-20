import { getRooms } from "@/lib/data";
import RoomsClient from '@/components/RoomsClient';
import { Plus } from "lucide-react";

export default async function Rooms() {
  const tabs = ['All Rooms', 'Room Types', 'Housekeeping'];
  const rooms = await getRooms()

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
          <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          Add Room
        </button>
      </header>

      {/* Content */}
      <main className="p-8">
        {/* Tabs + content (client) */}
        {/* RoomsClient is a client component that manages tab state */}
        <RoomsClient rooms={rooms} tabs={tabs} />
      </main>
    </div>
  );
}