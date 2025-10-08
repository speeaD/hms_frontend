'use client';
import { LayoutDashboard, Calendar, Users, Bed, UserCog, BarChart3, UserCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";




export function Sidebar() {
  const [isOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Calendar, label: 'Reservations', href: '/reservations' },
    // { icon: Users, label: 'Guests', href: '/guests' },
    { icon: Bed, label: 'Rooms', href: '/rooms' },
    { icon: UserCircle, label: 'Staff', href: '/staff' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
  ];
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-white border-r border-gray-200`}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hotelier</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-4">
            {menuItems.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      
                      setActiveItem(item.label);
                      
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 px-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <button className="text-xs text-gray-500 hover:text-gray-700">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}