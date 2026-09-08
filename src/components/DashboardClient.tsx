"use client";
import { Users, LogOut, Bed, MoreHorizontal, ArrowUp, Calendar, ChevronDown, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

export default function DashboardClient() {
  const reserves = [
    { guestName: 'Sophia Clark', roomNumber: '201', checkIn: '2024-07-26', checkOut: '2024-07-29', status: 'Checked In' },
    { guestName: 'Ethan Bennett', roomNumber: '305', checkIn: '2024-07-26', checkOut: '2024-07-28', status: 'Checked In' },
    { guestName: 'Olivia Carter', roomNumber: '102', checkIn: '2024-07-25', checkOut: '2024-07-27', status: 'Checked Out' },
    { guestName: 'Liam Harper', roomNumber: '402', checkIn: '2024-07-24', checkOut: '2024-07-26', status: 'Checked Out' },
    { guestName: 'Ava Foster', roomNumber: '203', checkIn: '2024-07-23', checkOut: '2024-07-25', status: 'Checked Out' },
    { guestName: 'Mason Green', roomNumber: '304', checkIn: '2024-07-22', checkOut: '2024-07-24', status: 'Checked Out' },
    { guestName: 'Isabella Lewis', roomNumber: '101', checkIn: '2024-07-21', checkOut: '2024-07-23', status: 'Checked Out' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedReserves = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return reserves.slice(start, start + rowsPerPage);
  }, [reserves, currentPage, rowsPerPage]);

  const stats = [
    {
      label: 'Check-Ins Today',
      value: 15,
      delta: '7%',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Check-Outs Today',
      value: 12,
      delta: '3%',
      icon: LogOut,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Rooms Available',
      value: 35,
      delta: '5%',
      icon: Bed,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Checked In':
        return 'bg-blue-50 text-blue-700';
      case 'Checked Out':
        return 'bg-gray-100 text-gray-600';
      case 'Cleaning':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getDotStyles = (status: string) => {
    switch (status) {
      case 'Checked In':
        return 'bg-blue-500';
      case 'Checked Out':
        return 'bg-gray-400';
      case 'Cleaning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Nmesoma</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Calendar size={16} className="text-blue-500" />
          Jul 24 – Jul 30, 2024
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </header>

      {/* Content */}
      <main className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                  <stat.icon size={22} className={stat.iconColor} />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUp size={14} />
                  {stat.delta}
                  <span className="text-gray-400 font-normal ml-1">vs yesterday</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-In Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-Out Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReserves.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                      No recent activity.
                    </td>
                  </tr>
                )}
                {paginatedReserves.map((reserve, index) => (
                  <tr key={reserve.guestName + index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{reserve.guestName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reserve.roomNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(reserve.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(reserve.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(reserve.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getDotStyles(reserve.status)}`}></span>
                        {reserve.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls for Recent Activity */}
        {reserves.length > rowsPerPage && (
          <div className="mt-4 flex items-center justify-between px-6">
            <div className="text-sm text-gray-600">
              Showing
              {(currentPage - 1) * rowsPerPage + 1}
              -
              {Math.min(currentPage * rowsPerPage, reserves.length)}
              of
              {reserves.length}
              activities
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Rows per page:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {Math.ceil(reserves.length / rowsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(reserves.length / rowsPerPage)))}
                  disabled={currentPage === Math.ceil(reserves.length / rowsPerPage)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}