export default function Home() {
  const reserves = [
    { guestName: 'Sophia Clark', roomNumber: '201', checkIn: '2024-07-26', checkOut: '2024-07-29', status: 'Checked In' },
    { guestName: 'Ethan Bennett', roomNumber: '305', checkIn: '2024-07-26', checkOut: '2024-07-28', status: 'Checked In' },
    { guestName: 'Olivia Carter', roomNumber: '102', checkIn: '2024-07-25', checkOut: '2024-07-27', status: 'Checked Out' },
    { guestName: 'Liam Harper', roomNumber: '402', checkIn: '2024-07-24', checkOut: '2024-07-26', status: 'Checked Out' },
    { guestName: 'Ava Foster', roomNumber: '203', checkIn: '2024-07-23', checkOut: '2024-07-25', status: 'Checked Out' },
    { guestName: 'Mason Green', roomNumber: '304', checkIn: '2024-07-22', checkOut: '2024-07-24', status: 'Checked Out' },
    { guestName: 'Isabella Lewis', roomNumber: '101', checkIn: '2024-07-21', checkOut: '2024-07-23', status: 'Checked Out' },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Checked In':
        return 'bg-blue-50 text-blue-700';
      case 'Checked Out':
        return 'bg-gray-50 text-gray-700';
      case 'Cleaning':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </header>

        {/* Content */}
        <main className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Check-Ins Today</p>
              <p className="text-4xl font-bold text-gray-900">15</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Check-Outs Today</p>
              <p className="text-4xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600 mb-2">Rooms Available</p>
              <p className="text-4xl font-bold text-gray-900">35</p>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-In Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-Out Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reserves.map((reserve, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{reserve.guestName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reserve.roomNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reserve.checkIn}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reserve.checkOut}</td>
                     
                      <td className="px-6 py-4 text-sm">
                         <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(reserve.status)}`}>
                          
                          {reserve.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
  );
}
