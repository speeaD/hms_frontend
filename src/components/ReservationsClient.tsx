"use client"

import { useMemo, useState } from "react"
import {
  CalendarCheck,
  CalendarDays,
  Search,
  Filter,
  Calendar,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
} from "lucide-react"
import type { EnrichedReservation } from "@/app/reservations/page"

interface Props {
  reservations: EnrichedReservation[]
}

const STATUS_OPTIONS = ['confirmed', 'pending', 'checked-in', 'checked-out', 'cancelled']
const PAGE_SIZE = 10

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function ReservationsClient({ reservations }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cancelled':
        return 'bg-red-50 text-red-700'
      case 'confirmed':
        return 'bg-green-50 text-green-700'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700'
      case 'checked-in':
        return 'bg-blue-50 text-blue-700'
      case 'checked-out':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cancelled':
        return 'bg-red-500'
      case 'confirmed':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'checked-in':
        return 'bg-blue-500'
      case 'checked-out':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getSourceStyles = (source: string) => {
    switch (source.toLowerCase()) {
      case 'walk-in':
        return 'bg-blue-50 text-blue-700'
      case 'online':
        return 'bg-purple-50 text-purple-700'
      case 'phone':
        return 'bg-orange-50 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  // ---- stats ----
  const stats = useMemo(() => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const weekFromNow = new Date()
    weekFromNow.setDate(today.getDate() + 7)

    const todayArrivals = reservations.filter((r) => isSameDay(new Date(r.checkInDate), today)).length
    const tomorrowArrivals = reservations.filter((r) => isSameDay(new Date(r.checkInDate), tomorrow)).length
    const thisWeekArrivals = reservations.filter((r) => {
      const d = new Date(r.checkInDate)
      return d >= today && d <= weekFromNow
    }).length

    return {
      today: todayArrivals,
      tomorrow: tomorrowArrivals,
      thisWeek: thisWeekArrivals,
      total: reservations.length,
    }
  }, [reservations])

  // ---- filtering ----
  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        search.trim() === '' ||
        r.guestName.toLowerCase().includes(search.toLowerCase()) ||
        String(r.roomNumber).toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(r.status.toLowerCase())
      return matchesSearch && matchesStatus
    })
  }, [reservations, search, statusFilters])

  // ---- pagination ----
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages, start + 2)
    for (let p = start; p <= end; p++) pages.push(p)
    return pages
  }, [currentPage, totalPages])

  const toggleStatusFilter = (status: string) => {
    setPage(1)
    setStatusFilters((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <CalendarCheck size={16} className="text-blue-500" />
            Today
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.today} <span className="text-sm font-normal text-gray-500">arrivals</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <CalendarDays size={16} className="text-gray-500" />
            Tomorrow
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.tomorrow} <span className="text-sm font-normal text-gray-500">arrivals</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-gray-500 text-sm mb-2">This Week</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.thisWeek} <span className="text-sm font-normal text-gray-500">arrivals</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-gray-500 text-sm mb-2">Total Reservations</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.total} <span className="text-sm font-normal text-gray-500">upcoming</span>
          </p>
        </div>
      </div>

      {/* Table panel */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-900">Reservations</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search guest or room..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  statusFilters.length > 0
                    ? 'border-blue-400 text-blue-600 bg-blue-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter size={15} />
                Filter
                {statusFilters.length > 0 && (
                  <span className="ml-1 flex items-center justify-center w-4 h-4 text-[10px] font-semibold text-white bg-blue-500 rounded-full">
                    {statusFilters.length}
                  </span>
                )}
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                  {STATUS_OPTIONS.map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={statusFilters.includes(status)}
                        onChange={() => toggleStatusFilter(status)}
                        className="accent-blue-600"
                      />
                      {status.replace('-', ' ')}
                    </label>
                  ))}
                  {statusFilters.length > 0 && (
                    <button
                      onClick={() => {
                        setStatusFilters([])
                        setPage(1)
                      }}
                      className="w-full text-left text-xs text-blue-600 hover:text-blue-700 px-2 py-1.5 mt-1 border-t border-gray-100"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <Calendar size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check-Out</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nights</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                    No reservations match your search.
                  </td>
                </tr>
              ) : (
                pageItems.map((reservation, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{reservation.guestName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reservation.roomNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(reservation.checkInDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(reservation.checkOutDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reservation.nights}</td>
                    <td className="px-6 py-4 text-sm">
                      {reservation.source ? (
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getSourceStyles(reservation.source)}`}>
                          {reservation.source}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(reservation.status)}`}>
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(reservation.status)}`}></span>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3 relative">
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuIndex === index && (
                          <div className="absolute right-0 top-6 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              View Details
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {rangeEnd} of {filtered.length} reservations
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-sm font-medium rounded-md ${
                  p === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-gray-500 border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-gray-500 border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}