"use client";

import { useState } from "react";
import {
  Home,
  User,
  ListChecks,
  FileText,
  Table,
  MessageCircle,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
  Briefcase,
  LogOut,
  RssIcon,
  ShoppingBagIcon,
  ContactRoundIcon,
} from "lucide-react";

interface SidebarProps {
  activeMenuItem: string;
  setActiveMenuItem: (menuItem: string) => void;
}

export default function Sidebar({
  activeMenuItem,
  setActiveMenuItem,
  isCollapsed,
  toggleSidebar,
}: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={24} /> },
    { name: "User Profile", icon: <User size={24} /> },
    { name: "Blogs", icon: <RssIcon size={24} /> },
    { name: "Recent Services", icon: <ShoppingBagIcon size={24} /> },
    { name: "Service Providers", icon: <ContactRoundIcon size={24} /> },
    { name: "Reviews & Feedback", icon: <Star size={24} /> },
    { name: "Services Management", icon: <Briefcase size={24} /> },
  ];

  return (
    <aside
      className={`h-screen bg-white shadow-md border-r border-gray-200 transition-all duration-300 fixed md:relative z-50 ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col justify-between`}
    >
      <div>
        <div className="flex justify-between items-center p-4">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-blue-600">HelperBuddy</h1>
          )}
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-1 pl-3">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => setActiveMenuItem(item.name)}
                className={`flex items-center gap-3 text-[15px] font-medium cursor-pointer px-3 py-2 rounded-lg transition ${
                  activeMenuItem === item.name
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.name}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={() => console.log("Logging out...")}
          className="flex items-center gap-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 px-3 py-2 rounded-lg transition"
        >
          <LogOut size={24} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
