'use client';
import { useState } from 'react';

export default function ReservationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: '',
    paymentMethod: ''
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Reservation Data:', formData);
    alert('Reservation submitted successfully!');
    setIsOpen(false);
    // Reset form
    setFormData({
      guestName: '',
      roomNumber: '',
      roomType: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: '',
      paymentMethod: ''
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="flex items-center justify-center bg-gray-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg"
        >
          + New Reservation
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">New Reservation</h1>
                <button
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
                {/* Guest Name */}
                <div>
                  <label htmlFor="guestName" className="block text-sm font-medium text-black mb-2">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    id="guestName"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    placeholder="Enter guest name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Room Number and Room Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-black mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. 101"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-black mb-2">
                      Room Type
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Select type</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="suite">Suite</option>
                      <option value="deluxe">Deluxe</option>
                    </select>
                  </div>
                </div>

                {/* Check-in and Check-out Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkInDate" className="block text-sm font-medium text-black mb-2">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOutDate" className="block text-sm font-medium text-black mb-2">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label htmlFor="numberOfGuests" className="block text-sm font-medium text-black mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    id="numberOfGuests"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleInputChange}
                    placeholder="Enter number"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-black mb-2">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Select method</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="debit-card">Debit Card</option>
                    <option value="cash">Cash</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Add Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}