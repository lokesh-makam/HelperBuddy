"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Package,
  Users,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Wallet,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useClerk } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();
  const handleLogout = async () => {
    await signOut(); // Clerk Sign-Out
  };
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Main Content - Adjusted for Navbar Height */}
      <div className="flex-1 flex items-center justify-center pt-16 p-4">
        {/* Container for Layout - Fixed Size */}
        <div className="w-full max-w-screen-xl h-[calc(90vh-4rem)] bg-black/10 shadow-lg rounded-lg flex overflow-hidden">
          {/* Sidebar */}
          <aside
            className={cn(
              "h-full shadow-lg transition-all duration-300 flex flex-col overflow-hidden",
              isOpen ? "w-72" : "w-20", // Toggle width
              "fixed md:relative top-0 left-0", // Mobile: Fixed, Desktop: Relative
              isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // Slide effect
              "bg-white md:bg-black/10" // Mobile: White, Desktop: Black/10
            )}
          >
            {/* Sidebar Toggle Button */}
            <div className="flex justify-between  items-center p-4 border-b">
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

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <NavItem
                icon={User}
                label="Profile"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                href="/profile"
                router={router}
              />
              <NavItem
                icon={MapPin}
                label="Address"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                href="/profile/address"
                router={router}
              />
              <NavItem
                icon={Package}
                label="Orders"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                href="/profile/orders"
                router={router}
              />
              <NavItem
                icon={Users}
                label="Referral"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                href="/profile/referral"
                router={router}
              />
              <NavItem
                icon={Wallet}
                label="Wallet"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                href="/profile/wallet"
                router={router}
              />
              <button onClick={handleLogout}>
                <NavItem
                  icon={LogOut}
                  label="Log Out"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  href="/"
                  router={router}
                />
              </button>
            </div>
          </aside>

          {/* Mobile Toggle Buttons */}
          <button
            className="md:hidden fixed left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg transition-all duration-300"
            onClick={() => setIsOpen(true)}
            style={{ left: isOpen ? "-9999px" : "0.5rem" }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            className="md:hidden fixed left-64 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg transition-all duration-300"
            onClick={() => setIsOpen(false)}
            style={{ left: isOpen ? "16rem" : "-9999px" }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Main Content */}
          <main className="flex-1 h-full overflow-y-auto">
            <div className="p-3 md:p-3">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Sidebar Item Component with Routing
const NavItem = ({
  icon: Icon,
  label,
  isOpen,
  setIsOpen,
  href,
  router,
}: {
  icon: any;
  label: string;
  isOpen: boolean;
  setIsOpen: any;
  href: string;
  router: any;
}) => (
  <button
    onClick={() => {
      router.push(href);

      setIsOpen(false);
    }}
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