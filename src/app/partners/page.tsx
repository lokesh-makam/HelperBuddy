"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Mail, Package, Star, Pencil, LayoutGrid } from "lucide-react";
import { cn } from "@/src/lib/utils";
import ServiceInvitations from "@/src/components/ServiceInvitations";
import RecentOrder from "@/src/components/RecentOrder";
import ReviewsPage from "@/src/components/Reviews";
import ServiceDashboard from "@/src/components/ServiceDashboard";

export default function Layout() {
    // Add client-side only state initialization
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [selectedSection, setSelectedSection] = useState("dashboard");

    // Use useEffect to handle client-side initialization
    useEffect(() => {
        setIsClient(true);
    }, []);

    // If not client-side yet, return a simple loading state or null
    if (!isClient) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center pt-16 p-4">
                <div className="w-full max-w-screen-xl h-[calc(90vh-4rem)] bg-black/10 shadow-lg rounded-lg flex overflow-hidden relative">
                    {/* Sidebar */}
                    <aside
                        className={cn(
                            "h-full shadow-lg transition-all duration-300 flex flex-col overflow-hidden z-50",
                            isOpen ? "w-72" : "w-20",
                            "fixed md:relative top-0 left-0",
                            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                            "bg-white md:bg-black/10"
                        )}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className={cn("text-xl font-bold transition-all", isOpen ? "block" : "hidden")}>
                                Helper Buddy
                            </h2>
                            <button
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <NavItem icon={LayoutGrid} label="Dashboard" isOpen={isOpen} onClick={() => setSelectedSection("dashboard")} />
                            <NavItem icon={Mail} label="Invitation" isOpen={isOpen} onClick={() => setSelectedSection("invitation")} />
                            <NavItem icon={Package} label="Recent Orders" isOpen={isOpen} onClick={() => setSelectedSection("recent-order")} />
                            <NavItem icon={Star} label="Reviews" isOpen={isOpen} onClick={() => setSelectedSection("review")} />
                            <NavItem icon={Pencil} label="Edit Service" isOpen={isOpen} onClick={() => setSelectedSection("edit")} />
                        </div>
                    </aside>

                    {/* Mobile Toggle Buttons */}
                    <button
                        className="md:hidden fixed left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg transition-all duration-300 z-50"
                        onClick={() => setIsOpen(true)}
                        style={{ left: isOpen ? "-9999px" : "0.5rem" }}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    <button
                        className="md:hidden fixed left-64 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg transition-all duration-300 z-50"
                        onClick={() => setIsOpen(false)}
                        style={{ left: isOpen ? "16rem" : "-9999px" }}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    {/* Main Content Area */}
                    <main className="flex-1 h-full overflow-y-auto">
                        <div className="p-3 md:p-3">
                            {selectedSection === "dashboard" && <ClientOnlyDashboard />}
                            {selectedSection === "invitation" && <ClientOnlyInvitation />}
                            {selectedSection === "recent-order" && <ClientOnlyRecentOrders />}
                            {selectedSection === "review" && <ClientOnlyReviews />}
                            {selectedSection === "edit" && <ClientOnlyEditService />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Sidebar Item Component
// @ts-ignore
const NavItem = ({ icon: Icon, label, isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center w-full px-4 py-3 rounded-lg text-black hover:bg-gray-100 transition"
    >
        <Icon className="h-5 w-5" />
        <span className={cn("ml-3 transition-all truncate", isOpen ? "block" : "hidden")}>{label}</span>
    </button>
);

// Client-only wrapper components
const ClientOnlyDashboard = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <ServiceDashboard />;
};

const ClientOnlyInvitation = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <ServiceInvitations />;
};

const ClientOnlyRecentOrders = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <RecentOrder />;
};

const ClientOnlyReviews = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <ReviewsPage />;
};

const ClientOnlyEditService = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return <h1>Edit Service Content</h1>;
};