import ReservationModal from "../../components/NewReservation";
import { ReservationsTable } from "../../components/ReservationsTable";
import { getAvailableRooms, getReservations } from "../../lib/data";

export const dynamic = "force-dynamic";

export default async function Reservations() {
  // Both fetched server-side, in parallel. Reservations already come with
  // `room` attached (see lib/data.ts), so there's no per-row lookup here
  // the way the previous version needed.
  const [reservations, rooms] = await Promise.all([
    getReservations(),
    getAvailableRooms(),
  ]);

  // Filter to only show upcoming reservations (not past)
  // Upcoming: checkOutDate >= today and status is not cancelled
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingReservations = reservations.filter((res: any) => {
    const checkOutDate = new Date(res.checkOutDate);
    return checkOutDate >= today && res.status !== 'cancelled';
  });

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <header className="px-8 py-8">
        <div className="flex">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Reservations</h1>
            <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
          </div>
          <div className="p-4">
            <ReservationModal rooms={rooms} />
          </div>
        </div>
      </header>
      <div className="bg-white rounded-lg shadow-sm m-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Reservations</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="shadow-sm bg-white">
            <ReservationsTable reservations={upcomingReservations} />
          </div>
        </div>
      </div>
    </div>
  );
}
