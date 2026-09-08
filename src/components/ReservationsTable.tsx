"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NativeDate from "@/components/NativeDate";
import { StatusBadge } from "@/components/StatusBadge";
import { ViewReservationModal } from "@/components/ViewReservationModal";
import { EditReservationStatusModal } from "@/components/EditReservationStatusModal";

export function ReservationsTable({ reservations }: { reservations: Reservations[] }) {
  const [viewing, setViewing] = useState<Reservations | null>(null);
  const [editing, setEditing] = useState<Reservations | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const router = useRouter();

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(reservations.length / rowsPerPage));
  const paginatedReservations = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return reservations.slice(startIndex, startIndex + rowsPerPage);
  }, [reservations, currentPage, rowsPerPage]);
  const rangeStart = reservations.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  return (
    <>
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
          {paginatedReservations.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                No reservations yet.
              </td>
            </tr>
          )}
          {paginatedReservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {reservation.firstName} {reservation.lastName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{reservation.room?.roomNumber ?? "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <NativeDate date={reservation.checkInDate} /> -- <NativeDate date={reservation.checkOutDate} />
              </td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge status={reservation.status} kind="reservation" />
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setViewing(reservation)}
                    className="text-gray-600 font-medium hover:text-gray-900"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(reservation)}
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {reservations.length > rowsPerPage && (
        // <div className="mt-4 flex items-center justify-between px-6">
        //   <div className="text-sm text-gray-600">
        //     Showing
        //     {(currentPage - 1) * rowsPerPage + 1}
        //     -
        //     {Math.min(currentPage * rowsPerPage, reservations.length)}
        //     of
        //     {reservations.length}
        //     reservations
        //   </div>
        //   <div className="flex items-center gap-4">
        //     <div className="flex items-center gap-2">
        //       <label className="text-sm text-gray-600">Rows per page:</label>
        //       <select
        //         value={rowsPerPage}
        //         onChange={(e) => {
        //           setRowsPerPage(Number(e.target.value));
        //           setCurrentPage(1); // Reset to first page when changing rows per page
        //         }}
        //         className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        //       >
        //         <option value={5}>5</option>
        //         <option value={10}>10</option>
        //         <option value={20}>20</option>
        //         <option value={50}>50</option>
        //         <option value={100}>100</option>
        //       </select>
        //     </div>
        //     <div className="flex items-center gap-2">
        //       <button
        //         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        //         disabled={currentPage === 1}
        //         className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
        //       >
        //         Previous
        //       </button>
        //       <span className="text-sm text-gray-600">
        //         Page {currentPage} of {totalPages}
        //       </span>
        //       <button
        //         onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        //         disabled={currentPage === totalPages}
        //         className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
        //       >
        //         Next
        //       </button>
        //     </div>
        //   </div>
        // </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {Math.min(currentPage * rowsPerPage, reservations.length)} of {reservations.length} Reservations
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

      {viewing && (
        <ViewReservationModal reservation={viewing} onClose={() => setViewing(null)} />
      )}

      {editing && (
        <EditReservationStatusModal
          reservation={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
