import NativeDate from "@/components/NativeDate"
import ReservationModal from "@/components/NewReservation"
import { getReservations, getRoomId } from "@/lib/data"

export const dynamic = "force-dynamic";

export default async function Reservations() {
    const reservations = await getReservations();
    const roomNumbers = Object.fromEntries(
        await Promise.all(
            reservations.map(async (reservation) => {
                const room = await getRoomId(reservation.roomId);
                return [reservation.roomId, room.roomNumber || "N/A"];
            })
        )
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'cancelled':
                return 'bg-red-50 text-red-700';
            case 'confirmed':
                return 'bg-green-50 text-green-700';
            case 'pending':
                return 'bg-yellow-50 text-yellow-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'cancelled':
                return 'bg-red-500';
            case 'confirmed':
                return 'bg-green-500';
            case 'pending':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };
    return (
        <div className="lg:ml-64 min-h-screen bg-gray-50">
            <header className="px-8 py-8">
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Reservations</h1>
                        <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
                    </div>
                    <div className="p-4">
                        <ReservationModal/>
                    </div>
                </div>
            </header>
            <div className="bg-white rounded-lg shadow-sm m-6">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Reservations</h2>
                </div>
                <div className="overflow-x-auto">
                    <div className="shadow-sm bg-white">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stay Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reservations.map((reservation, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{reservation.firstName + " " + reservation.lastName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{roomNumbers[reservation.roomId] ?? "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600"><NativeDate date={reservation.checkInDate} /> -- <NativeDate date={reservation.checkOutDate} /></td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(reservation.status)}`}>
                                                <span className={`w-2 h-2 rounded-full ${getStatusDot(reservation.status)}`}></span>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="text-blue-600 font-medium">Edit</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}