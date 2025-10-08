'use client';

import { useState } from "react";

export default async function Rooms(){
    const tabs = ['All Rooms', 'Room Types', 'Housekeeping'];
     const [activeTab, setActiveTab] = useState('All Rooms');
    const rooms = [
    { number: '101', type: 'Standard', status: 'Occupied', housekeeping: 'Assigned' },
    { number: '102', type: 'Deluxe', status: 'Vacant', housekeeping: 'Not Assigned' },
    { number: '103', type: 'Suite', status: 'Cleaning', housekeeping: 'In Progress' },
    { number: '104', type: 'Standard', status: 'Occupied', housekeeping: 'Assigned' },
    { number: '105', type: 'Deluxe', status: 'Vacant', housekeeping: 'Not Assigned' },
    { number: '106', type: 'Suite', status: 'Cleaning', housekeeping: 'In Progress' },
    { number: '107', type: 'Standard', status: 'Occupied', housekeeping: 'Assigned' },
    { number: '108', type: 'Deluxe', status: 'Vacant', housekeeping: 'Not Assigned' },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Occupied':
        return 'bg-red-50 text-red-700';
      case 'Vacant':
        return 'bg-green-50 text-green-700';
      case 'Cleaning':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Occupied':
        return 'bg-red-500';
      case 'Vacant':
        return 'bg-green-500';
      case 'Cleaning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
    return (
        
            
      <div className="lg:ml-64 min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
          <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Room Status Card */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Room Status</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Room Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Housekeeping
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.number} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{room.number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{room.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(room.status)}`}>
                          <span className={`w-2 h-2 rounded-full ${getStatusDot(room.status)}`}></span>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{room.housekeeping}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          View
                        </button>
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