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
} from "lucide-react";

import { useClerk } from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import Loading from "@/src/app/loading"; // Correct import for Clerk

interface SidebarProps {
  activeMenuItem: string;
  setActiveMenuItem: (menuItem: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
                                  activeMenuItem,
                                  setActiveMenuItem,
                                  isCollapsed,
                                  toggleSidebar,
                                }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: <Home size={24} /> },
    { name: "Blogs", icon: <Rss size={24} /> },
    { name: "Recent Services", icon: <ShoppingBag size={24} /> },
    { name: "Service Providers", icon: <BadgeCheck size={24} /> },
    { name: "Service Providers Services", icon: <Building size={24} /> },
    { name: "Reviews & Feedback", icon: <Star size={24} /> },
    { name: "Services Management", icon: <Briefcase size={24} /> },
  ];
  const [loading,setloading]=useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { signOut } = useClerk(); // Use the correct hook for Clerk
  const router=useRouter();
  const handleLogout = () => {
    setloading(true);
    signOut().then((r)=>{
      setloading(false);
      router.push('/');
      toast.success("You are logout successfully");
    });
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  if(loading){
    return <Loading/>
  }
  return (
      <>
        {/* Floating toggle button for mobile only - visible when sidebar is collapsed */}
        {isMobile && isCollapsed && (
            <button
                className="fixed top-1/2 left-2 z-[60] bg-blue-600 text-white p-2 rounded-full shadow-lg"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
        )}

        {/* Sidebar */}
        <aside
            className={`h-screen bg-white shadow-md border-r border-gray-200 flex flex-col justify-between 
          ${isMobile ? "fixed top-0 left-0" : "relative"} 
          transition-all duration-300 ease-in-out
          ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"} 
          ${!isMobile ? (isCollapsed ? "w-[4.5rem]" : "w-64") : "w-64"}
        `}
        >
          <div>
            <div className="flex justify-between items-center p-4">
              {!isCollapsed && (
                  <h1 className="text-2xl font-bold text-blue-600">HelperBuddy</h1>
              )}
              <button
                  className="p-1.5 md:p-2 rounded-full hover:bg-gray-200 ml-auto"
                  onClick={toggleSidebar}
              >
                {isCollapsed ? (
                    <ChevronRight className="w-5 h-5" />
                ) : (
                    <ChevronLeft className="w-5 h-5" />
                )}
              </button>
            </div>

            <nav className="flex-1">
              <ul className="space-y-1 pl-3">
                {menuItems.map((item) => (
                    <li
                        key={item.name}
                        onClick={() => setActiveMenuItem(item.name)}
                        className={`flex items-center gap-3 text-[15px] font-medium cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${
                            activeMenuItem === item.name
                                ? "bg-blue-100 text-blue-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                    >
                      <span className="hidden md:block">{item.icon}</span>
                      {!isCollapsed && <span>{item.name}</span>}
                    </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-4">
            <button
                onClick={handleLogout} // Calls handleLogout to sign out
                className="flex items-center gap-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out"
            >
              <LogOut size={24} className="hidden md:block" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Backdrop when sidebar is open on mobile */}
        {isMobile && !isCollapsed && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={toggleSidebar}
            />
        )}
      </>
  );
}