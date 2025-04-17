"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Mail,
  Package,
  Star,
  Pencil,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import ServiceInvitations from "@/src/components/ServiceInvitations";
import RecentOrder from "@/src/components/RecentOrder";
import ReviewsPage from "@/src/components/Reviews";
import ServiceDashboard from "@/src/components/ServiceDashboard";
import { useUser } from "@clerk/nextjs";
import { isServicePartner } from "@/src/actions/provider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "@/src/app/loading";
import ServicePage from "@/src/components/servicepartner/servicepage";
export default function Layout() {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [partner, setPartner] = useState<any>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const servicepartner = async () => {
      if (user) {
        const res = await isServicePartner(user.id);
        console.log(res);
        if (res.success) {
          if (res?.data?.status === "pending") {
            toast.error("Please wait for admin approval!");
            router.push("/provider");
            return;
          }
          if (res?.data?.status === "rejected") {
            toast.error(
              "Your documents are rejected by admin! Please Register as service partner again!"
            );
            router.push("/provider");
            return;
          }
          if (res?.data?.status === "approved") {
            setPartner(res?.data);
            setLoading(false);
            return;
          }
        } else {
          toast.error("Register first as service partner!");
          router.push("/provider");
          return;
        }
      }
    };
    servicepartner();
  }, [user]);
  if (loading) {
    return <Loading />;
  }
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
              <h2
                className={cn(
                  "text-xl font-bold transition-all",
                  isOpen ? "block" : "hidden"
                )}
              >
                Helper Buddy
              </h2>
              <button
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ChevronLeft className="h-6 w-6" />
                ) : (
                  <ChevronRight className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <NavItem
                icon={LayoutGrid}
                label="Dashboard"
                isOpen={isOpen}
                onClick={() => {
                  setSelectedSection("dashboard");
                  setIsOpen(false);
                }}
              />
              <NavItem
                icon={Mail}
                label="Invitation"
                isOpen={isOpen}
                onClick={() => {
                  setSelectedSection("invitation");
                  setIsOpen(false);
                }}
              />
              <NavItem
                icon={Package}
                label="Recent Orders"
                isOpen={isOpen}
                onClick={() => {
                  setSelectedSection("recent-order");
                  setIsOpen(false);
                }}
              />
              <NavItem
                icon={Star}
                label="Reviews"
                isOpen={isOpen}
                onClick={() => {
                  setSelectedSection("review");
                  setIsOpen(false);
                }}
              />
              <NavItem
                icon={Pencil}
                label="Apply for Service"
                isOpen={isOpen}
                onClick={() => {
                  setSelectedSection("edit");
                  setIsOpen(false);
                }}
              />
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
              {selectedSection === "dashboard" && (
                <ClientOnlyDashboard partnerdetails={partner} />
              )}
              {selectedSection === "invitation" && (
                <ClientOnlyInvitation partnerdetails={partner} />
              )}
              {selectedSection === "recent-order" && (
                <ClientOnlyRecentOrders partnerdetails={partner} />
              )}
              {selectedSection === "review" && (
                <ClientOnlyReviews partnerdetails={partner} />
              )}
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
    <span
      className={cn(
        "ml-3 transition-all truncate",
        isOpen ? "block" : "hidden"
      )}
    >
      {label}
    </span>
  </button>
);

// Client-only wrapper components
const ClientOnlyDashboard = (props: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ServiceDashboard partnerdetails={props.partnerdetails} />;
};

const ClientOnlyInvitation = (props: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ServiceInvitations partnerdetails={props.partnerdetails} />;
};

const ClientOnlyRecentOrders = (props: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <RecentOrder partnerdetails={props.partnerdetails} />;
};

const ClientOnlyReviews = (props: any) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ReviewsPage partnerdetails={props.partnerdetails} />;
};

const ClientOnlyEditService = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ServicePage />;
};
