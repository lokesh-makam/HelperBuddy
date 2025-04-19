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
import { useUser } from "@clerk/nextjs";
import { getuser } from "@/src/actions/user";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/src/app/loading";
export default function HomePage() {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setloading] = useState(true);
  const { user } = useUser();
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      const fun = async () => {
        const res1 = await getuser(user?.emailAddresses[0]?.emailAddress || "");
        if (res1?.role === "user") {
          toast.error("You are unauthorised to access this page!");
          router.push("/");
        } else {
          setloading(false);
        }
      };
      fun();
    }
  }, [user]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ${
          isMobile ? (isCollapsed ? "ml-0" : "ml-64") : "ml-0" // <- THIS IS KEY FOR DESKTOP, IGNORE COLLAPSE WIDTH SHIFT
        } flex-1`}
      >
        {/*<header className="bg-white shadow-md p-4 flex justify-between items-center shrink-0">*/}
        {/*  <div className="relative flex-1 max-w-md">*/}
        {/*    <input*/}
        {/*      type="text"*/}
        {/*      placeholder="Search..."*/}
        {/*      className="w-full rounded-full border px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</header>*/}

        <main className="flex-grow h-0 overflow-y-auto p-4 bg-gray-100">
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