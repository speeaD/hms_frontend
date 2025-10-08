'use client';
export default function Reservations() {
    const reservations = [
        { guestName: 'Sophia Clark', roomNumber: '101', dates: '2024-07-26', status: 'Edit' },
        { guestName: 'Ethan Bennett', roomNumber: '102', dates: '2024-07-26', status: 'Edit' },
        { guestName: 'Olivia Carter', roomNumber: '103', dates: '2024-07-25', status: 'Edit' },
        { guestName: 'Liam Harper', roomNumber: '104', dates: '2024-07-24', status: 'Edit' },
        { guestName: 'Ava Foster', roomNumber: '105', dates: '2024-07-23', status: 'Edit' },
        { guestName: 'Mason Green', roomNumber: '106', dates: '2024-07-22', status: 'Edit' },
        { guestName: 'Isabella Lewis', roomNumber: '107', dates: '2024-07-21', status: 'Edit' },
    ];
    return (
        <div className="lg:ml-64 min-h-screen bg-gray-50">
            <header className="px-8 py-8">
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Reservations</h1>
                        <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
                    </div>
                    <div className="p-4">
                        <button className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => {
                            //open a modal to create new reservation
                            alert('Open New Reservation Modal');
                        }}>
                            + New Reservation
                        </button>
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
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reservations.map((reservation, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{reservation.guestName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{reservation.roomNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{reservation.dates}</td>
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