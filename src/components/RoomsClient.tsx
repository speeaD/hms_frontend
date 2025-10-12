"use client"

import React, { useState } from 'react'
import { Tab } from './TabComponent'

interface Room {
  _id: number
  roomNumber: number
  type: string
  price: number
  status: string
  amenities: string[] | string
  capacity: number
}

interface Props {
  rooms: Room[]
  tabs: string[]
}

export default function RoomsClient({ rooms, tabs }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0] ?? '')

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-50 text-red-700'
      case 'confirmed':
        return 'bg-green-50 text-green-700'
      case 'available':
        return 'bg-green-50 text-green-700'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-500'
      case 'confirmed':
        return 'bg-green-500'
      case 'available':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div>
      <Tab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Room Status</h2>
        </div>

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
                  Amenities
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.roomNumber} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">{room.roomNumber}</span>
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
                    <span className="text-sm text-gray-600">{Array.isArray(room.amenities) ? room.amenities.join(', ') : String(room.amenities ?? '')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
