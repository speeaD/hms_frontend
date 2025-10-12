'use client';
import { useState } from 'react';

export default function StaffModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    contactNumber: '',
    email: '',
    schedule: ''
  });

  const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Employee Data:', formData);
    alert('Staff member added successfully!');
    setIsOpen(false);
    setFormData({
      fullName: '',
      role: '',
      contactNumber: '',
      email: '',
      schedule: ''
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFormData({
      fullName: '',
      role: '',
      contactNumber: '',
      email: '',
      schedule: ''
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="bg-gray-100 flex items-center justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Add Staff Member
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-12">
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Staff Member Details</h1>
              </div>
              
              <div className="space-y-8">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-base font-medium text-gray-600 mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-base font-medium text-gray-600 mb-3">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Select a role</option>
                      <option value="manager">Manager</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="housekeeper">Housekeeper</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="chef">Chef</option>
                    </select>
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Contact Number and Email Address */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactNumber" className="block text-base font-medium text-gray-600 mb-3">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-600 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label htmlFor="schedule" className="block text-base font-medium text-gray-600 mb-3">
                    Schedule
                  </label>
                  <textarea
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="e.g., Monday-Friday, 9am-5pm"
                    rows={4}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <button
                    onClick={handleCancel}
                    className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add Staff Member
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}