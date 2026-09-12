"use client"

import React, { useMemo, useState } from 'react'
import { Tab } from './TabComponent'
import {
  BedDouble,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Plus,
  Upload,
  Loader2,
  ChevronDown,
  X
} from 'lucide-react'
import { createRoom, bulkUploadRooms } from '../lib/data'
import { ROOT_SEGMENT_REQUEST_KEY } from 'next/dist/shared/lib/segment-cache/segment-value-encoding'

interface Room {
  id: string
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
  const [showAddRoomModal, setShowAddRoomModal] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addRoomLoading, setAddRoomLoading] = useState(false)
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false)
  const [addRoomSuccess, setAddRoomSuccess] = useState(false)
  const [bulkUploadSuccess, setBulkUploadSuccess] = useState(false)
  const [addRoomError, setAddRoomError] = useState<string | null>(null)
  const [bulkUploadError, setBulkUploadError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Form state for add room
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: '',
    price: '',
    status: 'available',
    amenities: '',
    capacity: '',
    floor: ''
  })

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

  // Pagination logic
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return rooms.slice(startIndex, startIndex + rowsPerPage)
  }, [rooms, currentPage, rowsPerPage])

  const totalPages = Math.max(1, Math.ceil(rooms.length / rowsPerPage))
  const rangeStart = rooms.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
  const rangeEnd = Math.min(currentPage * rowsPerPage, ROOT_SEGMENT_REQUEST_KEY.length)

  const handleAddRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRoomForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddRoomLoading(true)
    setAddRoomError(null)
    setAddRoomSuccess(false)

    try {
      const roomData: Omit<Rooms, 'id'> = {
        name: roomForm.roomNumber, // Assuming roomNumber is used as name
        roomNumber: roomForm.roomNumber,
        type: roomForm.type,
        price: Number(roomForm.price),
        status: roomForm.status as Rooms['status'],
        amenities: roomForm.amenities
          .split(',')
          .map((a: string) => a.trim())
          .filter(Boolean),
        capacity: Number(roomForm.capacity),
        floor: roomForm.floor ? Number(roomForm.floor) : undefined,
        bedType: "double" // Assuming bedType is optional and not provided in the form
     
      }

      const result = await createRoom(roomData)
      
      if (result) {
        setAddRoomSuccess(true)
        // Reset form
        setRoomForm({
          roomNumber: '',
          type: '',
          price: '',
          status: 'available',
          amenities: '',
          capacity: '',
          floor: ''
        })
        // Close modal after a short delay
        setTimeout(() => {
          setShowAddRoomModal(false)
        }, 1500)
      } else {
        throw new Error('Failed to create room')
      }
    } catch (error: any) {
      setAddRoomError(error.message || 'An error occurred while creating the room')
    } finally {
      setAddRoomLoading(false)
    }
  }

  const handleBulkUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBulkUploadLoading(true)
    setBulkUploadError(null)
    setBulkUploadSuccess(false)

    const formData = new FormData()
    const fileInput = document.getElementById('bulk-upload-file') as HTMLInputElement | null
    
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append('file', fileInput.files[0])
    }

    try {
      const result = await bulkUploadRooms(formData)
      
      if (result.success > 0) {
        setBulkUploadSuccess(true)
        // Reset file input
        if (fileInput) {
          fileInput.value = ''
        }
        // Close modal after a short delay
        setTimeout(() => {
          setShowBulkUploadModal(false)
        }, 1500)
      } else {
        throw new Error('No rooms were uploaded')
      }
    } catch (error: any) {
      setBulkUploadError(error.message || 'An error occurred during bulk upload')
    } finally {
      setBulkUploadLoading(false)
    }
  }

  return (
    <div className="lg:mx-10 min-h-screen bg-gray-50">
      {/* Header with buttons */}
      <div className="mb-6 pt-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600">Manage room statuses, housekeeping, and room types.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddRoomModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || addRoomLoading}
          >
            {addRoomLoading ? (
              <Loader2 size={16} className="mr-2" />
            ) : (
              <Plus size={16} />
            )}
            Add Room
          </button>
          
          <button
            onClick={() => setShowBulkUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || bulkUploadLoading}
          >
            {bulkUploadLoading ? (
              <Loader2 size={16} className="mr-2" />
            ) : (
              <Upload size={16} />
            )}
            Bulk Upload
          </button>
        </div>
      </div>

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

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Room</h2>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {addRoomSuccess && (
              <div className="bg-green-50 text-green-800 rounded-lg p-4 mb-4">
                Room added successfully!
              </div>
            )}
            
            {addRoomError && (
              <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-4">
                {addRoomError}
              </div>
            )}
            
            <form onSubmit={handleAddRoomSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={roomForm.roomNumber}
                  onChange={handleAddRoomChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  name="type"
                  value={roomForm.type}
                  onChange={handleAddRoomChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select room type</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                  <option value="deluxe">Deluxe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (NGN)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={roomForm.price}
                  onChange={handleAddRoomChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={roomForm.status}
                  onChange={handleAddRoomChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="reserved">Reserved</option>
                  <option value="out-of-service">Out of Service</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  name="amenities"
                  value={roomForm.amenities}
                  onChange={handleAddRoomChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={roomForm.capacity}
                  onChange={handleAddRoomChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor (optional)</label>
                <input
                  type="number"
                  name="floor"
                  value={roomForm.floor}
                  onChange={handleAddRoomChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addRoomLoading}
                  className={`px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors ${addRoomLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {addRoomLoading ? 'Adding...' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">Bulk Upload Rooms</h2>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {bulkUploadSuccess && (
              <div className="bg-green-50 text-green-800 rounded-lg p-4 mb-4">
                Rooms uploaded successfully!
              </div>
            )}
            
            {bulkUploadError && (
              <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-4">
                {bulkUploadError}
              </div>
            )}
            
            <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CSV file with room data
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Expected columns: roomNumber, type, price, status, amenities, capacity, floor
                </p>
                <input
                  type="file"
                  id="bulk-upload-file"
                  accept=".csv"
                  className="w-full mb-4"
                />
                {bulkUploadLoading && (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="mr-2" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkUploadLoading}
                  className={`px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors ${bulkUploadLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {bulkUploadLoading ? 'Uploading...' : 'Upload Rooms'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
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
              {paginatedRooms.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No rooms found.
                  </td>
                </tr>
              )}
              {paginatedRooms.map((room, index) => (
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

      {/* Pagination Controls */}
      {rooms.length > rowsPerPage && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {Math.min(currentPage * rowsPerPage, rooms.length)} of {rooms.length} Rooms
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setPage(1)
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
