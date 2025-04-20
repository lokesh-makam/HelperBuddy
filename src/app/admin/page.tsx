"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/app/admin/Sidebar";
import Dashboard from "@/src/app/admin/Dashboard";
import Blogs from "@/src/app/admin/Blogs";
import ServiceCards from "./RecentServices";
import AdminProviderApproval from "./ServiceProvider";
import Reviews from "./Reviews";
import ServiceManagement from "./ServiceManage";
import Invitation from "./servicereq";

export default function HomePage() {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${
        !isMobile && isCollapsed ? "ml-0" : 
        "ml-0"
      }`}>
        <main className="h-full overflow-y-auto p-4 bg-gray-100">
          {activeMenuItem === "Dashboard" && <Dashboard />}
          {activeMenuItem === "Blogs" && <Blogs />}
          {activeMenuItem === "Recent Services" && <ServiceCards />}
          {activeMenuItem === "Service Providers" && <AdminProviderApproval />}
          {activeMenuItem === "Reviews & Feedback" && <Reviews />}
          {activeMenuItem === "Services Management" && <ServiceManagement />}
          {activeMenuItem === "Service Providers Services" && <Invitation />}
        </main>
      </div>
    </div>
  );
}