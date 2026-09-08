import { getReservations } from "../../../lib/data";
import {ReservationsTable} from "../../../components/ReservationsTable";

export const dynamic = "force-dynamic";

export default async function AllReservations() {
  const reservations = await getReservations();

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <header className="px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Reservations</h1>
        <p className="text-gray-600">
          View lifetime activity of all reservations, including past, present, and future.
        </p>
      </header>
      <div className="bg-white rounded-lg shadow-sm m-6">
        <div className="overflow-x-auto">
          <ReservationsTable reservations={reservations} />
        </div>
      </div>
    </div>
  );
}