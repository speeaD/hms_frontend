"use client";
import { getMaintenanceData } from "@/lib/maintenance-data";
import { useMemo, useState } from "react";
import { XCircle, CheckCircle2, Loader2, Plus, Edit, Trash2 } from "lucide-react";

type MaintenanceData = Awaited<ReturnType<typeof getMaintenanceData>>;

interface MaintenanceDataProps {
  maintenanceData: MaintenanceData;
}

interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  roomId: string;
  roomNumber: number;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  createdAt: Date;
  scheduledFor: Date;
  completedAt?: Date;
}

type MaintenanceTaskForm = Partial<Omit<MaintenanceTask, "scheduledFor">> & {
  scheduledFor?: string;
};

export default function MaintenanceClient({ maintenanceData }: MaintenanceDataProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<MaintenanceTaskForm>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return maintenanceData.slice(start, start + rowsPerPage);
  }, [maintenanceData, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(maintenanceData.length / rowsPerPage));

  // Handler to open edit modal for a task
  const handleEditTask = (task: MaintenanceTask) => {
    setEditTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      roomNumber: task.roomNumber,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      scheduledFor: task.scheduledFor.toISOString().split('T')[0], // date only for input type="date"
    });
  };

  // Handler to open add task modal (empty form)
  const handleAddTask = () => {
    setEditTaskId("new");
    setTaskForm({
      title: "",
      description: "",
      roomNumber: 0,
      priority: "low",
      status: "pending",
      assignedTo: "",
      scheduledFor: new Date().toISOString().split('T')[0],
    });
  };

  // Close modals
  const closeTaskEdit = () => {
    setEditTaskId(null);
    setTaskForm({});
    setError(null);
    setSuccess(null);
  };

  // Simulate saving task (in real app would call API)
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editTaskId === "new") {
        // In real app: await createTask(taskForm as MaintenanceTask);
        setSuccess("Maintenance task added successfully!");
      } else {
        // In real app: await updateTask(editTaskId, taskForm as MaintenanceTask);
        setSuccess("Maintenance task updated successfully!");
      }

      // For demo, we won't actually update the list; in real app you would refetch or update state
      closeTaskEdit();
    } catch (err: any) {
      setError(err.message || "Failed to save maintenance task");
    } finally {
      setLoading(false);
    }
  };

  // Delete task (simulate)
  const handleDeleteTask = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In real app: await deleteTask(id);
      setSuccess("Maintenance task deleted successfully!");
      // Refetch or filter out
    } catch (err: any) {
      setError(err.message || "Failed to delete maintenance task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <header className="px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance</h1>
        <p className="text-gray-600">
          Manage maintenance tasks, work orders, and preventive maintenance schedules.
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

      <div className="mb-4 mx-6">
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Maintenance Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm m-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan={7}>
                    No maintenance tasks found
                  </td>
                </tr>
              )}
              {paginatedData.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Room {task.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.scheduledFor).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {editTaskId === task.id ? (
                      <>
                        <button
                          onClick={handleSaveTask}
                          disabled={loading}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={closeTaskEdit}
                          className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
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
      </div>

      {/* Pagination Controls */}
      {maintenanceData.length > rowsPerPage && (
        <div className="mt-4 flex items-center justify-between px-6">
          <div className="text-sm text-gray-600">
            Showing
            {(currentPage - 1) * rowsPerPage + 1}
            -
            {Math.min(currentPage * rowsPerPage, maintenanceData.length)}
            of
            {maintenanceData.length}
            tasks
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Task Modal */}
      {editTaskId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editTaskId === "new" ? "Add New Maintenance Task" : "Edit Maintenance Task"}
              </h2>
              <button onClick={closeTaskEdit} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  name="title"
                  value={taskForm.title ?? ""}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={taskForm.description ?? ""}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="number"
                  name="roomNumber"
                  value={taskForm.roomNumber ?? ""}
                  onChange={(e) => setTaskForm({ ...taskForm, roomNumber: Number(e.target.value) })}
                  required
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={taskForm.priority ?? "low"}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as "low" | "medium" | "high" })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={taskForm.status ?? "pending"}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as "pending" | "in-progress" | "completed" })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={taskForm.assignedTo ?? ""}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled For</label>
                <input
                  type="date"
                  name="scheduledFor"
                  value={taskForm.scheduledFor ?? ""}
                  onChange={(e) => setTaskForm({ ...taskForm, scheduledFor: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeTaskEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? "Saving..." : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}