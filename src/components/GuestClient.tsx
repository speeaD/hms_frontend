"use client"

import { useMemo, useState } from "react"
import {
  BedDouble,
  Target,
  DoorOpen,
  Users,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import type { Guest } from "@/lib/guests-data"

interface Props {
  guests: Guest[]
}

const PAGE_SIZE = 5
const STATUS_OPTIONS: Guest['status'][] = ['Checked In', 'Checked Out']

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getPaginationRange(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | 'ellipsis')[] = [1]
  if (current > 3) pages.push('ellipsis')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let p = start; p <= end; p++) pages.push(p)
  if (current < total - 2) pages.push('ellipsis')
  pages.push(total)
  return pages
}

export default function GuestsClient({ guests }: Props) {
  const [search, setSearch] = useState('')
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const stats = useMemo(() => {
    const total = guests.length
    const checkedIn = guests.filter((g) => g.status === 'Checked In').length
    const checkedOut = guests.filter((g) => g.status === 'Checked Out').length
    const frequent = guests.filter((g) => g.totalStays >= 5).length
    return { total, checkedIn, checkedOut, frequent }
  }, [guests])

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        q === '' ||
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q)
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(g.status)
      return matchesSearch && matchesStatus
    })
  }, [guests, search, statusFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)
  const paginationRange = useMemo(() => getPaginationRange(currentPage, totalPages), [currentPage, totalPages])

  const toggleStatusFilter = (status: string) => {
    setPage(1)
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const getStatusStyles = (status: Guest['status']) =>
    status === 'Checked In' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <BedDouble size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Guests</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.total} <span className="text-sm font-normal text-gray-500">All time</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Target size={20} className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Checked In</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.checkedIn} <span className="text-sm font-normal text-gray-500">Currently</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <DoorOpen size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Checked Out</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.checkedOut} <span className="text-sm font-normal text-gray-500">All time</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Users size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Frequent Guests</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.frequent} <span className="text-sm font-normal text-gray-500">Guests</span>
            </p>
          </div>
        </div>
      </div>

      {/* Table panel */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-end gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search guest by name, email or phone..."
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
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
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                {STATUS_OPTIONS.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(status)}
                      onChange={() => toggleStatusFilter(status)}
                      className="accent-blue-600"
                    />
                    {status}
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
            <Download size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stays</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Stay</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                    No guests match your search.
                  </td>
                </tr>
              ) : (
                pageItems.map((guest, index) => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.totalStays}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(guest.lastStay)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(guest.status)}`}>
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3 relative">
                        <button className="text-blue-600 hover:text-blue-700 font-medium">View</button>
                        <button
                          onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenuIndex === index && (
                          <div className="absolute right-0 top-6 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              Edit Guest
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                              Remove Guest
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
            Showing {rangeStart} to {rangeEnd} of {filtered.length} guests
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            {paginationRange.map((p, i) =>
              p === 'ellipsis' ? (
                <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-sm text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm font-medium rounded-md ${
                    p === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-gray-500 border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}