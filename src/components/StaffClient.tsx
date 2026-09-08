"use client";

import { useState, useMemo } from "react";
import { XCircle, CheckCircle2, Clock, Loader2, Plus, Edit, Trash2 } from "lucide-react";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string; // ISO string
}

interface StaffShift {
  id: string;
  staffId: string;
  date: string; // ISO string
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

interface StaffClientProps {
  staff: Staff[];
  shifts: StaffShift[];
}

export default function StaffClient({ staff, shifts }: StaffClientProps) {
  const [currentStaffPage, setCurrentStaffPage] = useState(1);
  const [currentShiftPage, setCurrentShiftPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editStaffId, setEditStaffId] = useState<string | null>(null);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState<Partial<Staff>>({});
  const [shiftForm, setShiftForm] = useState<Partial<StaffShift>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Paginated data
  const paginatedStaff = useMemo(() => {
    const start = (currentStaffPage - 1) * rowsPerPage;
    return staff.slice(start, start + rowsPerPage);
  }, [staff, currentStaffPage, rowsPerPage]);

  const paginatedShifts = useMemo(() => {
    const start = (currentShiftPage - 1) * rowsPerPage;
    return shifts.slice(start, start + rowsPerPage);
  }, [shifts, currentShiftPage, rowsPerPage]);

  const totalStaffPages = Math.max(1, Math.ceil(staff.length / rowsPerPage));
  const totalShiftPages = Math.max(1, Math.ceil(shifts.length / rowsPerPage));

  // Handler to open edit modal for staff
  const handleEditStaff = (staffMember: Staff) => {
    setEditStaffId(staffMember.id);
    setStaffForm({
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      email: staffMember.email,
      role: staffMember.role,
      status: staffMember.status,
    });
  };

  // Handler to open edit modal for shift
  const handleEditShift = (shift: StaffShift) => {
    setEditShiftId(shift.id);
    setShiftForm({
      staffId: shift.staffId,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
    });
  };

  // Close modals
  const closeStaffEdit = () => {
    setEditStaffId(null);
    setStaffForm({});
    setError(null);
    setSuccess(null);
  };

  const closeShiftEdit = () => {
    setEditShiftId(null);
    setShiftForm({});
    setError(null);
    setSuccess(null);
  };

  // Simulate saving staff (in real app would call API)
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app: await updateStaff(staffForm as Staff);
      setSuccess("Staff updated successfully!");
      // For demo, we won't actually update the list; in real app you would refetch or update state
      closeStaffEdit();
    } catch (err: any) {
      setError(err.message || "Failed to update staff");
    } finally {
      setLoading(false);
    }
  };

  // Simulate saving shift
  const handleSaveShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Shift updated successfully!");
      closeShiftEdit();
    } catch (err: any) {
      setError(err.message || "Failed to update shift");
    } finally {
      setLoading(false);
    }
  };

  // Delete staff (simulate)
  const handleDeleteStaff = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In real app: await deleteStaff(id);
      setSuccess("Staff deleted successfully!");
      // Refetch or filter out
    } catch (err: any) {
      setError(err.message || "Failed to delete staff");
    } finally {
      setLoading(false);
    }
  };

  // Delete shift
  const handleDeleteShift = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess("Shift deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <header className="px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
        <p className="text-gray-600">
          Manage staff members and their shifts.
        </p>
      </header>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg mx-6">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg mx-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 mx-6 mb-6">
        {/* Staff Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Staff Members</h2>
            <button
              onClick={() => {
                // Open add staff modal (for simplicity we reuse edit modal with empty form)
                setEditStaffId("new");
                setStaffForm({});
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Staff
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStaff.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-center text-gray-500" colSpan={6}>
                      No staff members found
                    </td>
                  </tr>
                )}
                {paginatedStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editStaffId === member.id ? (
                        <>
                          <button
                            onClick={handleSaveStaff}
                            disabled={loading}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={closeStaffEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditStaff(member)}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id)}
                            className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination for Staff */}
          {staff.length > rowsPerPage && (
            <div className="mt-4 flex items-center justify-between px-6">
              <div className="text-sm text-gray-600">
                Showing
                {(currentStaffPage - 1) * rowsPerPage + 1}
                -
                {Math.min(currentStaffPage * rowsPerPage, staff.length)}
                of
                {staff.length}
                staff
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Rows per page:</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentStaffPage(1);
                      setCurrentShiftPage(1);
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
                    onClick={() => setCurrentStaffPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentStaffPage === 1}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentStaffPage} of {totalStaffPages}
                  </span>
                  <button
                    onClick={() => setCurrentStaffPage((prev) => Math.min(prev + 1, totalStaffPages))}
                    disabled={currentStaffPage === totalStaffPages}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shifts Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Staff Shifts</h2>
            <button
              onClick={() => {
                setEditShiftId("new");
                setShiftForm({});
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Shift
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedShifts.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 text-center text-gray-500" colSpan={5}>
                      No shifts found
                    </td>
                  </tr>
                )}
                {paginatedShifts.map((shift) => {
                  // Find staff name for display
                  const staffMember = staff.find((s) => s.id === shift.staffId);
                  const staffName = staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : "Unknown";
                  return (
                    <tr key={shift.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staffName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(shift.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shift.startTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shift.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {editShiftId === shift.id ? (
                          <>
                            <button
                              onClick={handleSaveShift}
                              disabled={loading}
                              className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={closeShiftEdit}
                              className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditShift(shift)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteShift(shift.id)}
                              className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination for Shifts */}
          {shifts.length > rowsPerPage && (
            <div className="mt-4 flex items-center justify-between px-6">
              <div className="text-sm text-gray-600">
                Showing
                {(currentShiftPage - 1) * rowsPerPage + 1}
                -
                {Math.min(currentShiftPage * rowsPerPage, shifts.length)}
                of
                {shifts.length}
                shifts
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Rows per page:</label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentStaffPage(1);
                      setCurrentShiftPage(1);
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
                    onClick={() => setCurrentShiftPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentShiftPage === 1}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentShiftPage} of {totalShiftPages}
                  </span>
                  <button
                    onClick={() => setCurrentShiftPage((prev) => Math.min(prev + 1, totalShiftPages))}
                    disabled={currentShiftPage === totalShiftPages}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editStaffId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editStaffId === "new" ? "Add New Staff" : "Edit Staff Member"}
              </h2>
              <button onClick={closeStaffEdit} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={staffForm.firstName ?? ""}
                  onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={staffForm.lastName ?? ""}
                  onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={staffForm.email ?? ""}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={staffForm.role ?? ""}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  <option value="manager">Manager</option>
                  <option value="front_desk">Front Desk</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={staffForm.status ?? "active"}
                  onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value as "active" | "inactive" })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStaffEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Saving..." : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {editShiftId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editShiftId === "new" ? "Add New Shift" : "Edit Shift"}
              </h2>
              <button onClick={closeShiftEdit} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                <select
                  name="staffId"
                  value={shiftForm.staffId ?? ""}
                  onChange={(e) => setShiftForm({ ...shiftForm, staffId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select staff member</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={shiftForm.date ?? ""}
                  onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={shiftForm.startTime ?? ""}
                  onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={shiftForm.endTime ?? ""}
                  onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeShiftEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Saving..." : "Save Shift"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}