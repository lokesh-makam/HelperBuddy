"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Rss,
  ShoppingBag,
  BadgeCheck,
  Building,
  Star,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/src/app/loading";

interface SidebarProps {
  activeMenuItem: string;
  setActiveMenuItem: (menuItem: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export default function Sidebar({
  activeMenuItem,
  setActiveMenuItem,
  isCollapsed,
  toggleSidebar,
  isMobile,
}: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} /> },
    { name: "Blogs", icon: <Rss size={20} /> },
    { name: "Recent Services", icon: <ShoppingBag size={20} /> },
    { name: "Service Providers", icon: <BadgeCheck size={20} /> },
    { name: "Service Providers Services", icon: <Building size={20} /> },
    { name: "Reviews & Feedback", icon: <Star size={20} /> },
    { name: "Services Management", icon: <Briefcase size={20} /> },
  ];
  const [loading, setLoading] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = () => {
    setLoading(true);
    signOut().then((r) => {
      setLoading(false);
      router.push("/");
      toast.success("You are logged out successfully");
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Mobile menu button - always visible on mobile */}
      {isMobile && (
        <button
          className={`fixed top-4 left-4 z-50 p-2 rounded-md text-black transition-all duration-300 ${
            !isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`h-screen bg-white shadow-md border-r border-gray-200 flex flex-col justify-between 
          ${
            isMobile
              ? "fixed top-0 left-0 z-40"
              : "relative"
          }
          transition-all duration-300 ease-in-out
          ${
            isMobile
              ? isCollapsed
                ? "-translate-x-full"
                : "translate-x-0 w-64"
              : isCollapsed
              ? "w-20"
              : "w-64"
          }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {(!isCollapsed || isMobile) && (
            <h1 className="text-xl font-bold text-black whitespace-nowrap">
              HelperBuddy
            </h1>
          )}
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 ml-auto text-black"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              <X className="w-5 h-5" />
            ) : isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => {
                  setActiveMenuItem(item.name);
                  if (isMobile) toggleSidebar();
                }}
                className={`flex items-center gap-3 text-sm font-medium cursor-pointer px-3 py-3 rounded-lg transition-all duration-200 ease-in-out ${
                  activeMenuItem === item.name
                    ? "bg-gray-100 text-black font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!isCollapsed || isMobile) && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black px-3 py-3 rounded-lg transition-all duration-200 ease-in-out"
          >
            <LogOut size={20} />
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop when sidebar is open on mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}