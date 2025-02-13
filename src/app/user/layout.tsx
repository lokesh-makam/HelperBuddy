// "use client";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User profile",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-1/4 lg:w-1/5 bg-gray-50 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6">
            </h2>
            <ul className="space-y-4 text-gray-700">
              {[
                { name: "Account Information", path: "/profile/account-info" },
                { name: "My Orders", path: "/profile/orders" },
                { name: "Address Book", path: "/profile/address-book" },
                { name: "Newsletter Subscription", path: "/profile/newsletter" },
                { name: "Store Credit", path: "/profile/store-credit" },
                { name: "My Wishlist", path: "/profile/wishlist" },
                { name: "Change Password", path: "/profile/change-password" },
                { name: "Log Out", path: "/api/auth/signout" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className="font-semibold hover:text-blue-500 block py-2"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white p-6">{children}</main>
        </div>
        </div>
  );
}
