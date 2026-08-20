'use client';
import {
  Home,
  Calendar,
  Users,
  Bed,
  Sparkles,
  BarChart3,
  Settings,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SubItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: typeof Home;
  label: string;
  href: string;
  children?: SubItem[];
}

export function Sidebar() {
  const [isOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [expanded, setExpanded] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', href: '/' },
    {
      icon: Calendar,
      label: 'Reservations',
      href: '/reservations',
      children: [
        { label: 'Upcoming', href: '/reservations' },
        { label: 'Calendar', href: '/reservations/calendar' },
        { label: 'All Reservations', href: '/reservations/all' },
      ],
    },
    {
      icon: Bed,
      label: 'Rooms',
      href: '/rooms',
      children: [
        { label: 'All Rooms', href: '/rooms' },
        { label: 'Room Types', href: '/rooms/types' },
        { label: 'Housekeeping', href: '/rooms/housekeeping' },
      ],
    },
    { icon: Users, label: 'Guests', href: '/guests' },
    { icon: Sparkles, label: 'Housekeeping', href: '/housekeeping' },
    { icon: BarChart3, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const handleParentClick = (item: MenuItem) => {
    if (item.children) {
      setExpanded((prev) => (prev === item.label ? null : item.label));
    } else {
      setActiveItem(item.label);
    }
  };

  const handleChildClick = (parentLabel: string, childLabel: string) => {
    setActiveItem(childLabel);
    setExpanded(parentLabel);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 bg-[#0B1437] border-r border-white/5`}
    >
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-6 h-20 shrink-0">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <div className="w-5 h-5 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold text-white">Hotelier</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-4">
          <ul className="space-y-1 px-4">
            {menuItems.map((item) => {
              const hasChildren = !!item.children;
              const isExpanded = expanded === item.label;
              const isParentActive =
                hasChildren && item.children!.some((c) => c.label === activeItem);
              const isActive = !hasChildren && activeItem === item.label;

              return (
                <li key={item.label}>
                  {hasChildren ? (
                    <button
                      onClick={() => handleParentClick(item)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-colors ${
                        isExpanded || isParentActive
                          ? 'text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon
                        size={19}
                        className={isExpanded || isParentActive ? 'text-white' : 'text-slate-400'}
                      />
                      <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => handleParentClick(item)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#4C5FE0] text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon size={19} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )}

                  {hasChildren && isExpanded && (
                    <ul className="mt-1 mb-1 space-y-1">
                      {item.children!.map((child) => {
                        const isChildActive = activeItem === child.label;
                        return (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={() => handleChildClick(item.label, child.label)}
                              className={`block ml-11 mr-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isChildActive
                                  ? 'bg-[#4C5FE0] text-white font-medium'
                                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Notifications */}
        <div className="px-6 py-3 shrink-0">
          <button className="relative flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="text-sm font-medium">Notifications</span>
            <span className="ml-auto flex items-center justify-center w-5 h-5 text-[11px] font-semibold text-white bg-blue-500 rounded-full">
              1
            </span>
          </button>
        </div>

        {/* User profile section */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <button className="flex items-center gap-3 px-2 py-1 w-full rounded-lg hover:bg-white/5 transition-colors">
            <div className="w-9 h-9 rounded-full bg-indigo-400/80 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              N
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-white truncate">Nmesoma</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <ChevronDown size={16} className="text-slate-400 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}