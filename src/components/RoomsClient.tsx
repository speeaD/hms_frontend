"use client"

import React, { useMemo, useState } from 'react'
import { Tab } from './TabComponent'
import { BedDouble, CheckCircle2, Clock, XCircle, MoreVertical } from 'lucide-react'

interface Room {
  _id: number
  roomNumber: number
  type: string
  price: number
  status: string
  amenities: string[] | string
  capacity: number
  floor?: number
}

interface Props {
  rooms: Room[]
  tabs: string[]
}

const OUT_OF_SERVICE_STATUSES = ['out-of-service', 'maintenance', 'unavailable']

export default function RoomsClient({ rooms, tabs }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0] ?? '')
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-50 text-green-700'
      case 'occupied':
        return 'bg-yellow-50 text-yellow-700'
      case 'cleaning':
        return 'bg-blue-50 text-blue-700'
      default:
        if (OUT_OF_SERVICE_STATUSES.includes(status.toLowerCase())) {
          return 'bg-red-50 text-red-700'
        }
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500'
      case 'occupied':
        return 'bg-yellow-500'
      case 'cleaning':
        return 'bg-blue-500'
      default:
        if (OUT_OF_SERVICE_STATUSES.includes(status.toLowerCase())) {
          return 'bg-red-500'
        }
        return 'bg-gray-400'
    }
  }

  const getFloor = (room: Room) => room.floor ?? Math.floor(room.roomNumber / 100)

  const stats = useMemo(() => {
    const total = rooms.length
    const available = rooms.filter((r) => r.status.toLowerCase() === 'available').length
    const occupied = rooms.filter((r) => r.status.toLowerCase() === 'occupied').length
    const outOfService = rooms.filter((r) => OUT_OF_SERVICE_STATUSES.includes(r.status.toLowerCase())).length
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0)
    return {
      total,
      available,
      occupied,
      outOfService,
      availablePct: pct(available),
      occupiedPct: pct(occupied),
      outOfServicePct: pct(outOfService),
    }
  }, [rooms])

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <BedDouble size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total} <span className="text-sm font-normal text-gray-500">rooms</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Available</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.available} <span className="text-sm font-normal text-green-600">{stats.availablePct}%</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
            <Clock size={20} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Occupied</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.occupied} <span className="text-sm font-normal text-yellow-600">{stats.occupiedPct}%</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <XCircle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Out of Service</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.outOfService} <span className="text-sm font-normal text-red-500">{stats.outOfServicePct}%</span>
            </p>
          </div>
        </div>
      </div>

      <Tab tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map((room, index) => (
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
                    <span className="text-sm text-gray-600">
                      {Array.isArray(room.amenities) ? room.amenities.join(', ') : String(room.amenities ?? '')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{getFloor(room)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 relative">
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View</button>
                      <button
                        onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuIndex === index && (
                        <div className="absolute right-0 top-6 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                          <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Edit Room
                          </button>
                          <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            Mark Out of Service
                          </button>
                        </div>
                      )}
                    </div>
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