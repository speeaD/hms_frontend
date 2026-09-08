"use client";

import { useState, useTransition } from "react";
import { updateReservationStatus } from "@/lib/actions";

const STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked in" },
  { value: "checked_out", label: "Checked out" },
  { value: "cancelled", label: "Cancelled" },
];

export function EditReservationStatusModal({
  reservation,
  onClose,
  onSaved,
}: {
  reservation: Reservations;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<ReservationStatus>(reservation.status as ReservationStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateReservationStatus(reservation.id, status);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onSaved();
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Update status</h2>
          <p className="text-sm text-gray-500 mt-1">
            {reservation.firstName} {reservation.lastName} · Room {reservation.room?.roomNumber ?? "N/A"}
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Reservation status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReservationStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Changing this also updates the room&rsquo;s availability automatically.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || status === reservation.status}
              className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
