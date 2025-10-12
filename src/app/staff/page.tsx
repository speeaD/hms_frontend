import StaffModal from "@/components/NewStaff";
import { getStaff } from "@/lib/data";

export default async function Staff() {


    const staffMembers = await getStaff();

    return (
        <div className="lg:ml-64 min-h-screen bg-gray-50">
            <header className="px-8 py-8">
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
                        <p className="text-gray-600">Manage staff members, roles, schedules and contact information.</p>
                    </div>
                    <div className="p-4">
                        <StaffModal />
                    </div>
                </div>
            </header>

                        <div className="bg-white rounded-lg shadow-sm m-6">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Staff</h2>
                </div>
            <div className="overflow-x-auto">
                <div className="shadow-sm bg-white">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {staffMembers.map((staff, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{staff.firstName + " " + staff.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{staff.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{staff.phone}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="text-blue-600 font-medium">Edit</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
                        </div>
        </div>
    );
}