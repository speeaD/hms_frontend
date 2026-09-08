"use client";

import NativeDate from "@/components/NativeDate";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatRoomType, nightsBetween } from "@/lib/format";


export function ViewReservationModal({
  reservation,
  onClose,
}: {
  reservation: Reservations;
  onClose: () => void;
}) {
  const nights = nightsBetween(reservation.checkInDate, reservation.checkOutDate);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Reservation details</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={reservation.status} kind="reservation" />
            <StatusBadge status={reservation.paymentStatus} kind="payment" />
          </div>

          <section>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Guest</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="text-gray-900 mt-0.5">{reservation.firstName} {reservation.lastName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Guests</dt>
                <dd className="text-gray-900 mt-0.5">{reservation.numberOfGuests}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="text-gray-900 mt-0.5 break-all">{reservation.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="text-gray-900 mt-0.5">{reservation.phone}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Stay</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Room</dt>
                <dd className="text-gray-900 mt-0.5">
                  {reservation.room?.roomNumber ?? "N/A"}
                  {reservation.room ? ` · ${formatRoomType(reservation.room.type)}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Nights</dt>
                <dd className="text-gray-900 mt-0.5">{nights}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Check-in</dt>
                <dd className="text-gray-900 mt-0.5"><NativeDate date={reservation.checkInDate} /></dd>
              </div>
              <div>
                <dt className="text-gray-500">Check-out</dt>
                <dd className="text-gray-900 mt-0.5"><NativeDate date={reservation.checkOutDate} /></dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Payment</h3>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Total</dt>
                <dd className="text-gray-900 mt-0.5">{formatCurrency(reservation.totalAmount)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Booked on</dt>
                <dd className="text-gray-900 mt-0.5"><NativeDate date={reservation.createdAt} /></dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
