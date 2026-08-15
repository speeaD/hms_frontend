import { getRooms } from "@/lib/data";
import RoomsClient from '@/components/RoomsClient';

export const dynamic = "force-dynamic";

export default async function Rooms(){
    const tabs = ['All Rooms', 'Room Types', 'Housekeeping'];
    const rooms =  await getRooms()
    return (
        
            
      <div className="lg:ml-64 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
          <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
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