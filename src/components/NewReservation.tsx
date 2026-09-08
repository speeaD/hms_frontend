"use client";

import { useMemo, useState, useTransition } from "react";
import { createReservation } from "@/lib/actions";
import { formatCurrency, formatRoomType, nightsBetween } from "@/lib/format";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  roomId: "",
  checkInDate: "",
  checkOutDate: "",
  numberOfGuests: "1",
  totalAmount: "",
  markAsPaid: false,
};

export default function ReservationModal({ rooms }: { rooms: Rooms[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === formData.roomId),
    [rooms, formData.roomId]
  );

  const nights =
    formData.checkInDate && formData.checkOutDate
      ? nightsBetween(formData.checkInDate, formData.checkOutDate)
      : 0;

  const suggestedTotal =
    selectedRoom && nights > 0 ? Number(selectedRoom.price) * nights : undefined;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };

      // Auto-fill the total whenever room or dates change. The admin can
      // still overwrite it by hand afterwards.
      if (name === "roomId" || name === "checkInDate" || name === "checkOutDate") {
        const room = name === "roomId" ? rooms.find((r) => r.id === value) : selectedRoom;
        const inDate = name === "checkInDate" ? value : prev.checkInDate;
        const outDate = name === "checkOutDate" ? value : prev.checkOutDate;
        if (room && inDate && outDate && new Date(outDate) > new Date(inDate)) {
          next.totalAmount = String(Number(room.price) * nightsBetween(inDate, outDate));
        }
      }

      return next;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData(emptyForm);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createReservation({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roomId: formData.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        numberOfGuests: Number(formData.numberOfGuests) || 1,
        totalAmount: Number(formData.totalAmount),
        markAsPaid: formData.markAsPaid,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      handleClose();
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg"
      >
        + New Reservation
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">New Reservation</h1>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                      First name
                    </label>
                    <input
                      required
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
                      Last name
                    </label>
                    <input
                      required
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                      Phone
                    </label>
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="roomId" className="block text-sm font-medium text-black mb-2">
                    Room
                  </label>
                  <select
                    required
                    id="roomId"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select an available room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.roomNumber} — {formatRoomType(room.type)} ({formatCurrency(room.price)}/night)
                      </option>
                    ))}
                  </select>
                  {rooms.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">No available rooms right now.</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkInDate" className="block text-sm font-medium text-black mb-2">
                      Check-in date
                    </label>
                    <input
                      required
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOutDate" className="block text-sm font-medium text-black mb-2">
                      Check-out date
                    </label>
                    <input
                      required
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="numberOfGuests" className="block text-sm font-medium text-black mb-2">
                      Guests
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      id="numberOfGuests"
                      name="numberOfGuests"
                      value={formData.numberOfGuests}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="totalAmount" className="block text-sm font-medium text-black mb-2">
                      Total amount
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      id="totalAmount"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                    {suggestedTotal !== undefined && (
                      <p className="mt-2 text-xs text-gray-500">
                        {nights} night{nights === 1 ? "" : "s"} × {formatCurrency(selectedRoom?.price)} ={" "}
                        {formatCurrency(suggestedTotal)}
                      </p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="markAsPaid"
                    checked={formData.markAsPaid}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Payment already received (phone or walk-in booking)
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? "Adding…" : "Add Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
